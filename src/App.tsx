import { useState, useEffect, useCallback } from 'react'
import { TopNavigation } from './components/organisms/TopNavigation'
import { MembersDirectory } from './pages/MembersDirectory'
import { AddMember } from './pages/AddMember'
import { EditMember } from './pages/EditMember'
import { SuccessModal } from './components/modals/SuccessModal'
import { ConfirmDeleteModal } from './components/modals/ConfirmDeleteModal'
import { ErrorModal } from './components/modals/ErrorModal'
import {
  getCurrentUser,
  getDepartments,
  getMembers,
  getMemberStats,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  bulkDeleteMembers,
} from './services/api'
import type {
  CurrentUser,
  DashboardStats,
  Department,
  Member,
  MemberDetail,
  AccountStatus,
  AccessLevel,
  EmploymentType,
} from './types'

type ViewTab = 'directory' | 'add' | 'edit'

export function App() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [departments, setDepartments] = useState<Department[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activeTab, setActiveTab] = useState<ViewTab>('directory')
  const [editingMember, setEditingMember] = useState<MemberDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({})

  // Modals state
  const [successModal, setSuccessModal] = useState<{
    title: string
    message: string
    name?: string
    id?: string
    secondaryText?: string
    onSecondary?: () => void
    primaryText?: string
    onPrimary: () => void
  } | null>(null)

  const [confirmDelete, setConfirmDelete] = useState<{
    type: 'single' | 'bulk'
    member?: Member
    ids?: string[]
  } | null>(null)

  const [errorModal, setErrorModal] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    try {
      const [userRes, deptRes, membersRes, statsRes] = await Promise.all([
        getCurrentUser(),
        getDepartments(),
        getMembers(),
        getMemberStats(),
      ])
      setCurrentUser(userRes)
      setDepartments(deptRes)
      setMembers(membersRes.data)
      setStats(statsRes)
    } catch (err: any) {
      setErrorModal(err.message || 'Failed to load initial data.')
    }
  }, [])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const handleAddSubmit = async (formData: {
    name: string
    email: string
    jobTitle: string
    departmentId: string
    accountStatus: AccountStatus
    accessLevel: AccessLevel
    employmentType: EmploymentType
    bio: string
  }) => {
    setLoading(true)
    setServerErrors({})
    try {
      const newMember = await createMember(formData)
      await loadData()
      setSuccessModal({
        title: 'Member Added Successfully',
        message: 'New member has been created and assigned successfully.',
        name: newMember.name,
        id: newMember.id,
        primaryText: 'Back to Dashboard',
        onPrimary: () => {
          setSuccessModal(null)
          setActiveTab('directory')
        },
      })
    } catch (err: any) {
      if (err.status === 422 && err.errors) {
        setServerErrors(err.errors)
      } else {
        setErrorModal(err.message || 'Failed to create member.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleEditSubmit = async (formData: {
    name: string
    email: string
    jobTitle: string
    departmentId: string
    accountStatus: AccountStatus
    accessLevel: AccessLevel
    employmentType: EmploymentType
    bio: string
  }) => {
    if (!editingMember) return
    setLoading(true)
    setServerErrors({})
    try {
      const updated = await updateMember(editingMember.id, formData)
      await loadData()
      setEditingMember(updated)
      setSuccessModal({
        title: 'Member Updated Successfully',
        message: 'Member profile has been updated successfully.',
        name: updated.name,
        id: updated.id,
        secondaryText: 'Continue Editing',
        onSecondary: () => setSuccessModal(null),
        primaryText: 'Back to Dashboard',
        onPrimary: () => {
          setSuccessModal(null)
          setActiveTab('directory')
        },
      })
    } catch (err: any) {
      if (err.status === 422 && err.errors) {
        setServerErrors(err.errors)
      } else {
        setErrorModal(err.message || 'Failed to update member.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleOpenEdit = async (member: Member) => {
    try {
      setLoading(true)
      const detail = await getMemberById(member.id)
      setEditingMember(detail)
      setActiveTab('edit')
    } catch (err: any) {
      setErrorModal(err.message || 'Failed to load member detail.')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return
    setLoading(true)
    try {
      if (confirmDelete.type === 'single' && confirmDelete.member) {
        const deleted = await deleteMember(confirmDelete.member.id)
        await loadData()
        setConfirmDelete(null)
        setSuccessModal({
          title: 'Member Deleted Successfully',
          message: 'Member has been deleted successfully.',
          name: deleted.name,
          id: deleted.id,
          primaryText: 'Dismiss',
          onPrimary: () => setSuccessModal(null),
        })
      } else if (confirmDelete.type === 'bulk' && confirmDelete.ids) {
        const res = await bulkDeleteMembers(confirmDelete.ids)
        await loadData()
        setConfirmDelete(null)
        setSuccessModal({
          title: 'Members Deleted Successfully',
          message: `${res.deletedCount} members have been deleted successfully.`,
          primaryText: 'Dismiss',
          onPrimary: () => setSuccessModal(null),
        })
      }
    } catch (err: any) {
      setConfirmDelete(null)
      setErrorModal(err.message || 'Failed to delete member(s).')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased">
      <TopNavigation
        currentUser={currentUser}
        activeTab={activeTab === 'edit' ? 'directory' : activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab)
          setServerErrors({})
        }}
      />

      <main>
        {activeTab === 'directory' && (
          <MembersDirectory
            members={members}
            stats={stats}
            departments={departments}
            onAddMemberClick={() => {
              setActiveTab('add')
              setServerErrors({})
            }}
            onEditMember={(m) => void handleOpenEdit(m)}
            onDeleteMember={(m) => setConfirmDelete({ type: 'single', member: m })}
            onBulkDelete={(ids) => setConfirmDelete({ type: 'bulk', ids })}
          />
        )}

        {activeTab === 'add' && (
          <AddMember
            departments={departments}
            onSubmit={handleAddSubmit}
            onCancel={() => setActiveTab('directory')}
            loading={loading}
            serverErrors={serverErrors}
          />
        )}

        {activeTab === 'edit' && editingMember && (
          <EditMember
            member={editingMember}
            departments={departments}
            onSubmit={handleEditSubmit}
            onCancel={() => setActiveTab('directory')}
            onCopyId={(id) => navigator.clipboard.writeText(id)}
            loading={loading}
            serverErrors={serverErrors}
          />
        )}
      </main>

      {/* Modals */}
      {successModal && (
        <SuccessModal
          title={successModal.title}
          message={successModal.message}
          memberName={successModal.name}
          memberId={successModal.id}
          primaryText={successModal.primaryText}
          onPrimary={successModal.onPrimary}
          secondaryText={successModal.secondaryText}
          onSecondary={successModal.onSecondary}
        />
      )}

      {confirmDelete && (
        <ConfirmDeleteModal
          title={
            confirmDelete.type === 'single' ? 'Delete Member' : 'Delete Selected Members'
          }
          message={
            confirmDelete.type === 'single'
              ? `Are you sure you want to delete ${confirmDelete.member?.name}? This action cannot be undone.`
              : `Are you sure you want to delete ${confirmDelete.ids?.length} selected members? This action cannot be undone.`
          }
          itemName={confirmDelete.member?.name}
          onConfirm={() => void handleConfirmDelete()}
          onCancel={() => setConfirmDelete(null)}
          loading={loading}
        />
      )}

      {errorModal && <ErrorModal message={errorModal} onClose={() => setErrorModal(null)} />}
    </div>
  )
}
export default App
