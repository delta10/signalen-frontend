import { useEffect } from 'react'

import type { Incident } from 'types/api/incident'

import { StyledLegend } from '../../incident-management/containers/IncidentDetail/components/StatusForm/styled'
import useFetchRelatedSignals from '../hooks/useFetchRelatedSignals'

interface RelatedSignalsNotificationProps {
  incident: Incident | undefined
}

const RelatedSignalsNotification: React.FC<RelatedSignalsNotificationProps> = ({
  incident,
}) => {
  const {
    data: getRelatedSignalsData,
    get: getRelatedSignals,
    isLoading: getRelatedSignalsIsLoading,
  } = useFetchRelatedSignals()

  useEffect(() => {
    if (incident) {
      getRelatedSignals(Number(incident.id))
    }
  }, [getRelatedSignals, incident])

  if (getRelatedSignalsIsLoading) {
    return null
  }

  if (!getRelatedSignalsData || getRelatedSignalsData.length == 0) {
    return null
  }

  return (
    <fieldset>
      <StyledLegend>Gekoppeld</StyledLegend>
      <div>
        Er {getRelatedSignalsData.length == 1 ? 'is' : 'zijn'}{' '}
        {getRelatedSignalsData.length} gekoppelde{' '}
        {getRelatedSignalsData.length == 1 ? 'melding' : 'meldingen'}.
      </div>
    </fieldset>
  )
}

export default RelatedSignalsNotification
