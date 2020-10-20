export interface IAcquire {
  resourceId: string
}

export interface IAcquireReqBody {
  cname: string,
  uid: string,
  clientRequest: {
    resourceExpiredHour: number
  }
}
