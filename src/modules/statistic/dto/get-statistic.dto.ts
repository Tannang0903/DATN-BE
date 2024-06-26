import { EventStatus, ProofStatus } from '@prisma/client'

export class GetEventAttendanceStudentStatisticQueryDto {
  type: string
  startAt?: Date
  endAt?: Date
  numberOfRecords: number
}

export class EventStatisticDto {
  total: number
  data: EventStatisticRecordDto[]
}

export class EventStatisticRecordDto {
  status: EventStatus
  count: number
}

export class ProofStatisticDto {
  total: number
  data: ProofStatisticRecordDto[]
}

export class ProofStatisticRecordDto {
  status: ProofStatus
  count: number
}
