export interface UkGovCovidApiDataPoint {
  date: string
  areaName: string
  areaCode: string
  newCases: number | null
  cumCasesByPublishDate: number | null
  newDeathsByDeathDate: number | null
  cumDeathsByDeathDate: number | null
  // newTestsByPublishDate: number | null
  newPCRTestsByPublishDate: number | null
}

export interface UkGovCovidApiResponse {
  length: number
  maxPageLimit: number
  data: UkGovCovidApiDataPoint[]
  pagination: {
    current: string
    next: string | null
    previous: string | null
    first: string | null
    last: string | null
  }
}
