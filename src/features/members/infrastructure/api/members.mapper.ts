import { MemberEntity } from '../../domain/members.entity'
import type { Member } from '../../../../types'

export class MembersMapper {
  static toEntity(dto: Member): MemberEntity {
    return new MemberEntity(
      dto.id,
      dto.name,
      dto.email,
      dto.avatar,
      dto.jobTitle,
      dto.department,
      dto.accountStatus,
      dto.accessLevel,
      dto.employmentType,
      dto.bio || null,
      dto.joinedAt,
    )
  }
}
