import configuration from 'shared/services/configuration/configuration'

import { useBuildGetter } from '../../../hooks/api/useBuildGetter'

const useGetRelatedIncidents = () =>
  useBuildGetter<any>((id: number) => [
    `${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}/related`,
  ])

export default useGetRelatedIncidents
