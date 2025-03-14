import { useEffect } from 'react'

import { Button } from '@amsterdam/asc-ui'
import { useParams } from 'react-router-dom'

import { getAuthHeaders } from 'shared/services/auth/auth'
import configuration from 'shared/services/configuration/configuration'
import type { Incident } from 'types/api/incident'

import useFetchRelatedSignals from '../hooks/useFetchRelatedSignals'

interface LinkUnlinkButtonProps {
  incident: Incident
}

const LinkUnlinkButton: React.FC<LinkUnlinkButtonProps> = ({ incident }) => {
  const { id } = useParams<{ id: string }>()

  const {
    data: getRelatedSignalsData,
    get: getRelatedSignals,
    isLoading: getRelatedSignalsIsLoading,
  } = useFetchRelatedSignals()

  useEffect(() => {
    getRelatedSignals(Number(id))
  }, [getRelatedSignals, id])

  const linkSignal = (targetId: number) => {
    fetch(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}/related`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: targetId }),
    }).then(() => getRelatedSignals(Number(id)))
  }

  const unlinkSignal = (targetId: number) => {
    fetch(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}/related`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: targetId }),
    }).then(() => getRelatedSignals(Number(id)))
  }

  if (getRelatedSignalsIsLoading) {
    return null
  }

  const isRelated =
    getRelatedSignalsData &&
    getRelatedSignalsData.length > 0 &&
    getRelatedSignalsData.filter((signal: any) => signal.id === incident.id)
      .length > 0

  return isRelated ? (
    <Button
      type="button"
      variant="application"
      onClick={() => unlinkSignal(incident.id)}
    >
      Ontkoppel
    </Button>
  ) : (
    <Button
      type="button"
      variant="application"
      onClick={() => linkSignal(incident.id)}
    >
      Koppel
    </Button>
  )
}

export default LinkUnlinkButton
