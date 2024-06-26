import { EventAttendanceInfo, EventRegistrationInfo, EventStatus } from '@prisma/client'

export const validateBirth = (dob: Date) => {
  const age = new Date().getFullYear() - new Date(dob).getFullYear() + 1
  return age >= 18
}

export const getCurrentEventStatus = (
  startAt: Date,
  endAt: Date,
  status: EventStatus,
  eventAttendanceInfos: EventAttendanceInfo[],
  eventRegistrationInfos: EventRegistrationInfo[]
) => {
  const now = new Date()
  if (
    status === EventStatus.Approved &&
    startAt <= now &&
    endAt >= now &&
    eventAttendanceInfos.some((attendanceInfo) => attendanceInfo.startAt <= now && attendanceInfo.endAt >= now)
  ) {
    return EventStatus.Attendance
  } else if (status === EventStatus.Approved && startAt <= now && endAt >= now) {
    return EventStatus.Happening
  } else if (
    status === EventStatus.Approved &&
    startAt >= now &&
    eventRegistrationInfos.some((registrationInfo) => now >= registrationInfo.startAt && now <= registrationInfo.endAt)
  ) {
    return EventStatus.Registration
  } else if (
    status === EventStatus.Approved &&
    startAt >= now &&
    eventRegistrationInfos.every((registrationInfo) => now >= registrationInfo.endAt)
  ) {
    return EventStatus.ClosedRegistration
  } else if (EventStatus.Approved && startAt >= now) {
    return EventStatus.Upcoming
  } else if (EventStatus.Approved && endAt <= now) {
    return EventStatus.Done
  } else if (
    status === EventStatus.Pending &&
    eventRegistrationInfos.some((registrationInfo) => registrationInfo.startAt <= now)
  ) {
    return EventStatus.Expired
  } else if (status === EventStatus.Cancelled) {
    return EventStatus.Cancelled
  } else if (status === EventStatus.Rejected) {
    return EventStatus.Rejected
  } else if (status === EventStatus.Pending) {
    return EventStatus.Pending
  }

  return status
}

export const getCurrentEventInfos = (startAt: Date, endAt: Date) => {
  const now = new Date()
  if (startAt <= now && endAt >= now) {
    return EventStatus.Happening
  } else if (startAt >= now) {
    return EventStatus.Upcoming
  } else if (endAt <= now) {
    return EventStatus.Done
  }
}
