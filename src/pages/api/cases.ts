import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { UkGovCovidApiResponse } from 'src/ukGovCovidData'

const API_BASE_URL = 'https://api.coronavirus.data.gov.uk'
const API_VERSION = 'v1'

const ukGovCovidApi = axios.create({
  baseURL: `${API_BASE_URL}/${API_VERSION}`,
  headers: { Accepts: 'application/json', 'Content-Type': 'application/json' },
})

// const filters = { areaType: 'region', areaName: 'london' }
const filters = { areaType: 'overview', areaName: 'United Kingdom' }

const dataMappings = {
  date: 'date',
  areaName: 'areaName',
  areaCode: 'areaCode',
  newCases: 'newCasesByPublishDate',
  cumCasesByPublishDate: 'cumCasesByPublishDate',
  newDeathsByDeathDate: 'newDeathsByDeathDate',
  cumDeathsByDeathDate: 'cumDeathsByDeathDate',
  // newTestsByPublishDate: 'newTestsByPublishDate',
  newPCRTestsByPublishDate: 'newPCRTestsByPublishDate',
}

// const foo = {
//   date: 'date',
//   newPillarOneTestsByPublishDate: 'newPillarOneTestsByPublishDate',
//   newPillarTwoTestsByPublishDate: 'newPillarTwoTestsByPublishDate',
//   newPillarThreeTestsByPublishDate: 'newPillarThreeTestsByPublishDate',
//   newPillarFourTestsByPublishDate: 'newPillarFourTestsByPublishDate',
// }

export const getCases = async (): Promise<UkGovCovidApiResponse> => {
  const data = await ukGovCovidApi.get<UkGovCovidApiResponse>('/data', {
    params: {
      // filters: 'areaType=region;areaName=london',
      filters: Object.entries(filters)
        .map(([key, value]) => `${key}=${value}`)
        .join(';'),
      structure: JSON.stringify(dataMappings),
    },
  })
  return data.data
}

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const data = await getCases()
  res.statusCode = 200
  res.json(data)
}
