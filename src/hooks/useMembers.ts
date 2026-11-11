import { useState, useCallback, useEffect } from 'react'
import { MembersController } from '../features/members/controller/members.controller'
import type { CurrentUser, Department, AccountStatus, AccessLevel, EmploymentType, Member, MemberDetail, DashboardStats } from '../types'

const controller = new MembersController()

export function useMembersController() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [departments, setDepartments] = useState<Department[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [errorModal, setErrorModal] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const data = await controller.getDashboardData()
      setCurrentUser(data.currentUser)
      setDepartments(data.departments)
      setMembers(data.members)
      setStats(data.stats)
    } catch (err: any) {
      setErrorModal(err.message || 'Failed to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const createMemberHandler = async (payload: {
    name: string
    email: string
    jobTitle: string
    departmentId: string
    accountStatus: AccountStatus
    accessLevel: AccessLevel
    employmentType: EmploymentType
    bio: string
  }) => {
    return controller.createMember(payload)
  }

  const updateMemberHandler = async (id: string, payload: any) => {
    return controller.updateMember(id, payload)
  }

  const deleteMemberHandler = async (id: string) => {
    return controller.deleteMember(id)
  }

  const bulkDeleteHandler = async (ids: string[]) => {
    return controller.bulkDeleteMembers(ids)
  }

  const getMemberDetailHandler = async (id: string): Promise<MemberDetail> => {
    return controller.getMemberDetail(id)
  }

  return {
    currentUser,
    departments,
    members,
    stats,
    loading,
    errorModal,
    setErrorModal,
    loadData,
    createMemberHandler,
    updateMemberHandler,
    deleteMemberHandler,
    bulkDeleteHandler,
    getMemberDetailHandler,
  }
}
