import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/database'
import { GetProofsDto, ProofExternalDto, ProofInternalDto, ProofSpecialDto, RejectProofDto } from './dto'
import { EventService } from '@modules/events'
import { getOrderBy, Pagination, RequestUser, searchByMode } from 'src/common'
import { Prisma, Proof, ProofStatus, ProofType } from '@prisma/client'
import { isEmpty } from 'lodash'
import { GetAllProofsOrderByEnum } from './proof.enum'

@Injectable()
export class ProofService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventService: EventService
  ) {}

  getAll = async (params: GetProofsDto) => {
    const { search, sorting, status, type } = params

    const pageSize = params.pageSize ? params.pageSize : 10
    const page = params.page ? params.page : 1

    const whereConditions: Prisma.Enumerable<Prisma.ProofWhereInput> = []

    if (search) {
      whereConditions.push({
        OR: [
          {
            description: searchByMode(search)
          }
        ]
      })
    }

    if (type) {
      whereConditions.push({
        proofType: type
      })
    }

    if (status) {
      whereConditions.push({
        proofStatus: status
      })
    }

    const mappedOrder = {
      [GetAllProofsOrderByEnum.STUDENTNAME]: 'proof.student.fullname'
    }

    const orderBy = getOrderBy<Proof>({ defaultValue: 'createdAt', order: sorting, mappedOrder })

    const [total, proofs] = await Promise.all([
      this.prisma.proof.count({
        where: {
          AND: whereConditions
        }
      }),
      this.prisma.proof.findMany({
        where: {
          AND: whereConditions
        },
        select: {
          id: true,
          proofStatus: true,
          proofType: true,
          description: true,
          imageUrl: true,
          attendanceAt: true,
          createdAt: true,
          updatedAt: true,
          internalProof: {
            select: {
              event: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          },
          externalProof: true,
          specialProof: true,
          student: true
        },
        take: pageSize,
        skip: Number((page - 1) * pageSize),
        orderBy: orderBy
      })
    ])

    const listProofs = proofs.map((proof) => {
      return {
        id: proof.id,
        eventName: proof.internalProof?.event?.name || proof.externalProof?.eventName || proof.specialProof?.title,
        student: {
          id: proof.student.id,
          fullname: proof.student.fullname
        },
        created: proof.createdAt,
        lastModified: proof.updatedAt,
        proofType: proof.proofType,
        proofStatus: proof.proofStatus
      }
    })

    return Pagination.of(page, pageSize, total, listProofs)
  }

  getAllByStudentId = async (studentId: string) => {
    const proofs = await this.prisma.proof.findMany({
      where: {
        student: {
          id: studentId
        }
      },
      select: {
        id: true,
        proofStatus: true,
        proofType: true,
        description: true,
        imageUrl: true,
        attendanceAt: true,
        createdAt: true,
        updatedAt: true,
        internalProof: {
          select: {
            event: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        externalProof: true,
        specialProof: true,
        student: true
      }
    })

    return proofs.map((proof) => {
      return {
        id: proof.id,
        eventName: proof.internalProof?.event?.name || proof.externalProof?.eventName || proof.specialProof?.title,
        student: {
          id: proof.student.id,
          fullname: proof.student.fullname
        },
        created: proof.createdAt,
        lastModified: proof.updatedAt,
        proofType: proof.proofType,
        proofStatus: proof.proofStatus
      }
    })
  }

  getById = async (id: string) => {
    const proof = await this.prisma.proof.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        proofStatus: true,
        proofType: true,
        description: true,
        rejectReason: true,
        imageUrl: true,
        attendanceAt: true,
        createdAt: true,
        updatedAt: true,
        internalProof: {
          select: {
            event: {
              select: {
                id: true,
                name: true,
                startAt: true,
                endAt: true,
                fullAddress: true,
                organizationRepresentative: {
                  select: {
                    eventOrganization: {
                      select: {
                        name: true
                      }
                    }
                  }
                },
                eventActivity: {
                  select: {
                    id: true,
                    name: true,
                    eventCategoryId: true,
                    maxScore: true,
                    minScore: true
                  }
                }
              }
            },
            eventRole: {
              select: {
                id: true,
                name: true,
                score: true
              }
            }
          }
        },
        externalProof: {
          select: {
            eventName: true,
            address: true,
            startAt: true,
            endAt: true,
            role: true,
            score: true,
            organizationName: true,
            eventActivity: {
              select: {
                id: true,
                name: true,
                eventCategoryId: true,
                maxScore: true,
                minScore: true
              }
            }
          }
        },
        specialProof: {
          select: {
            title: true,
            startAt: true,
            endAt: true,
            role: true,
            score: true,
            eventActivity: {
              select: {
                id: true,
                name: true,
                eventCategoryId: true,
                maxScore: true,
                minScore: true
              }
            }
          }
        },
        student: true
      }
    })

    if (isEmpty(proof)) {
      throw new BadRequestException({
        message: 'Proof with given id does not exist',
        error: 'Proof:000001',
        statusCode: 400
      })
    }

    const proofDetail = {
      id: proof.id,
      description: proof.description,
      rejectReason: proof.rejectReason,
      imageUrl: proof.imageUrl,
      proofType: proof.proofType,
      proofStatus: proof.proofStatus,
      eventId: proof.internalProof?.event?.id,
      eventName: proof.internalProof?.event?.name || proof.externalProof?.eventName || proof.specialProof?.title,
      address: proof.internalProof?.event?.fullAddress || proof.externalProof?.address,
      organizationName:
        proof.internalProof?.event?.organizationRepresentative?.eventOrganization?.name ||
        proof.externalProof?.organizationName,
      role: proof.internalProof?.eventRole?.name || proof.externalProof?.role || proof.specialProof?.role,
      score: proof.internalProof?.eventRole?.score || proof.externalProof?.score || proof.specialProof?.score,
      student: {
        id: proof.student.id,
        fullname: proof.student.fullname,
        imageUrl: proof.student.imageUrl,
        email: proof.student.email
      },
      activity: {
        id:
          proof.internalProof?.event?.eventActivity?.id ||
          proof.externalProof?.eventActivity?.id ||
          proof.specialProof?.eventActivity?.id,
        eventCategoryId:
          proof.internalProof?.event?.eventActivity?.eventCategoryId ||
          proof.externalProof?.eventActivity?.eventCategoryId ||
          proof.specialProof?.eventActivity?.eventCategoryId,
        name:
          proof.internalProof?.event?.eventActivity?.name ||
          proof.externalProof?.eventActivity?.name ||
          proof.specialProof?.eventActivity?.name,
        minScore:
          proof.internalProof?.event?.eventActivity?.minScore ||
          proof.externalProof?.eventActivity?.minScore ||
          proof.specialProof?.eventActivity?.minScore,
        maxScore:
          proof.internalProof?.event?.eventActivity?.maxScore ||
          proof.externalProof?.eventActivity?.maxScore ||
          proof.specialProof?.eventActivity?.maxScore
      },
      startAt: proof.internalProof?.event?.startAt || proof.externalProof?.startAt || proof.specialProof?.startAt,
      endAt: proof.internalProof?.event?.endAt || proof.externalProof?.endAt || proof.specialProof?.endAt,
      created: proof.createdAt,
      lastModified: proof.updatedAt,
      attendanceAt: proof.attendanceAt
    }

    return proofDetail
  }

  makeProofInternal = async (user: RequestUser, data: ProofInternalDto) => {
    const { eventId, eventRoleId, attendanceAt, description, imageUrl } = data

    await this.eventService.getById(user, eventId)

    const student = await this.prisma.identityUser.findUnique({
      where: {
        id: user.id
      },
      select: {
        id: true,
        student: true
      }
    })

    return await this.prisma.$transaction(async (trx) => {
      const proof = await trx.proof.create({
        data: {
          proofType: ProofType.Internal,
          proofStatus: ProofStatus.Pending,
          description,
          imageUrl,
          attendanceAt: new Date(attendanceAt).toISOString(),
          studentId: student.student.id,
          createdBy: user.id
        }
      })

      await trx.internalProof.create({
        data: {
          id: proof.id,
          eventId,
          roleId: eventRoleId
        }
      })

      return proof
    })
  }

  makeProofExternal = async (user: RequestUser, data: ProofExternalDto) => {
    const {
      activityId,
      address,
      startAt,
      endAt,
      eventName,
      organizationName,
      role,
      score,
      attendanceAt,
      description,
      imageUrl
    } = data

    const student = await this.prisma.identityUser.findUnique({
      where: {
        id: user.id
      },
      select: {
        id: true,
        student: true
      }
    })

    return await this.prisma.$transaction(async (trx) => {
      const proof = await trx.proof.create({
        data: {
          proofType: ProofType.External,
          proofStatus: ProofStatus.Pending,
          description,
          imageUrl,
          attendanceAt: new Date(attendanceAt).toISOString(),
          studentId: student.student.id,
          createdBy: user.id
        }
      })

      await trx.externalProof.create({
        data: {
          id: proof.id,
          eventName,
          address,
          startAt: new Date(startAt).toISOString(),
          endAt: new Date(endAt).toISOString(),
          activityId,
          role,
          score: Number(score),
          organizationName
        }
      })

      return proof
    })
  }

  makeProofSpecial = async (user: RequestUser, data: ProofSpecialDto) => {
    const { title, activityId, startAt, endAt, role, score, description, imageUrl } = data

    const student = await this.prisma.identityUser.findUnique({
      where: {
        id: user.id
      },
      select: {
        id: true,
        student: true
      }
    })

    return await this.prisma.$transaction(async (trx) => {
      const proof = await trx.proof.create({
        data: {
          proofType: ProofType.Special,
          proofStatus: ProofStatus.Pending,
          description,
          imageUrl,
          studentId: student.student.id,
          createdBy: user.id
        }
      })

      await trx.specialProof.create({
        data: {
          id: proof.id,
          title,
          role,
          startAt: new Date(startAt).toISOString(),
          endAt: new Date(endAt).toISOString(),
          activityId,
          score: Number(score)
        }
      })

      return proof
    })
  }

  editProofInternal = async (id: string, user: RequestUser, data: ProofInternalDto) => {
    const { eventId, eventRoleId, attendanceAt, description, imageUrl } = data

    const proof = await this.getById(id)

    await this.eventService.getById(user, eventId)

    const student = await this.prisma.identityUser.findUnique({
      where: {
        id: user.id
      },
      select: {
        id: true,
        student: true
      }
    })

    return await this.prisma.$transaction(async (trx) => {
      const updateProof = await trx.proof.update({
        where: {
          id
        },
        data: {
          proofType: ProofType.Internal,
          proofStatus: ProofStatus.Pending,
          description,
          imageUrl,
          attendanceAt: new Date(attendanceAt).toISOString(),
          studentId: student.student.id,
          createdBy: user.id
        }
      })

      await trx.internalProof.update({
        where: {
          id
        },
        data: {
          id: proof.id,
          eventId,
          roleId: eventRoleId
        }
      })

      return updateProof
    })
  }

  editProofExternal = async (id: string, user: RequestUser, data: ProofExternalDto) => {
    const {
      activityId,
      address,
      startAt,
      endAt,
      eventName,
      organizationName,
      role,
      score,
      attendanceAt,
      description,
      imageUrl
    } = data

    const proof = await this.getById(id)

    const student = await this.prisma.identityUser.findUnique({
      where: {
        id: user.id
      },
      select: {
        id: true,
        student: true
      }
    })

    return await this.prisma.$transaction(async (trx) => {
      const updateProof = await trx.proof.update({
        where: {
          id
        },
        data: {
          proofType: ProofType.External,
          proofStatus: ProofStatus.Pending,
          description,
          imageUrl,
          attendanceAt: new Date(attendanceAt).toISOString(),
          studentId: student.student.id,
          createdBy: user.id
        }
      })

      await trx.externalProof.update({
        where: {
          id
        },
        data: {
          id: proof.id,
          eventName,
          address,
          startAt: new Date(startAt).toISOString(),
          endAt: new Date(endAt).toISOString(),
          activityId,
          role,
          score: Number(score),
          organizationName
        }
      })

      return updateProof
    })
  }

  editProofSpecial = async (id: string, user: RequestUser, data: ProofSpecialDto) => {
    const { title, activityId, startAt, endAt, role, score, description, imageUrl } = data

    const proof = await this.getById(id)

    const student = await this.prisma.identityUser.findUnique({
      where: {
        id: user.id
      },
      select: {
        id: true,
        student: true
      }
    })

    return await this.prisma.$transaction(async (trx) => {
      const updateProof = await trx.proof.update({
        where: {
          id
        },
        data: {
          proofType: ProofType.Special,
          proofStatus: ProofStatus.Pending,
          description,
          imageUrl,
          studentId: student.student.id,
          createdBy: user.id
        }
      })

      await trx.specialProof.update({
        where: {
          id
        },
        data: {
          id: proof.id,
          title,
          role,
          startAt: new Date(startAt).toISOString(),
          endAt: new Date(endAt).toISOString(),
          activityId,
          score: Number(score)
        }
      })

      return updateProof
    })
  }

  delete = async (id: string) => {
    const proof = await this.getById(id)

    await this.prisma.proof.delete({
      where: { id: proof.id }
    })
  }

  approve = async (id: string) => {
    const proof = await this.getById(id)

    return await this.prisma.proof.update({
      where: {
        id: proof.id
      },
      data: {
        proofStatus: ProofStatus.Approved
      }
    })
  }

  reject = async (id: string, data: RejectProofDto) => {
    const proof = await this.getById(id)

    return await this.prisma.proof.update({
      where: {
        id: proof.id
      },
      data: {
        proofStatus: ProofStatus.Rejected,
        rejectReason: data.rejectReason
      }
    })
  }
}
