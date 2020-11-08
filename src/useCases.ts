import axios from 'axios'
import { useQuery } from 'react-query'
import { UkGovCovidApiResponse } from './ukGovCovidData'

export const fetchCases = async () => {
  const data = await axios.get<UkGovCovidApiResponse>('/api/cases')
  return data.data
}

export const useCases = (initialData?: UkGovCovidApiResponse) => {
  const { data, isLoading, isFetching, isError, status } = useQuery(['cases'], fetchCases, {
    initialData,
    initialStale: true,
  })

  return {
    cases: data,
    isLoading: isLoading || isFetching,
    isError,
    status,
  }
}
