// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as reactRedux from 'react-redux'
import * as reactRouterDom from 'react-router-dom'

import departmentsFixture from 'utils/__tests__/fixtures/departments.json'

import { Filter } from './Filter'
import { withAppContext } from '../../../../../../test/utils'
import history from '../../../../../../utils/history'
import IncidentManagementContext from '../../../../context'

const mockCallback = jest.fn()

window.HTMLElement.prototype.scrollIntoView = jest.fn()

const departments = {
  ...departmentsFixture,
  count: departmentsFixture.count,
  list: departmentsFixture.results,
}

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/',
    referrer: '/manage/incidents',
  }),
}))

describe('FilterComponent', () => {
  beforeEach(() => {
    jest.spyOn(reactRedux, 'useSelector').mockReturnValue(departments)

    mockCallback.mockReset()
  })

  it('should render properly and select the first option', () => {
    render(<Filter callback={mockCallback} />)

    expect(
      screen.queryByRole('combobox', {
        name: 'Politie',
      })
    ).not.toBeInTheDocument()

    expect(
      screen.getByRole('combobox', { name: 'Actie Service Centr...' })
    ).toBeInTheDocument()
  })

  it('should clear filterActiveName when clicking outside Filter', () => {
    render(
      <>
        <button>outside filter</button>
        <Filter callback={mockCallback} />
      </>
    )

    userEvent.click(
      screen.getByRole('combobox', {
        name: 'Actie Service Centr...',
      })
    )

    userEvent.click(
      screen.getByRole('button', {
        name: 'outside filter',
      })
    )

    expect(
      screen.queryByRole('option', { name: 'Amsterdamse Bos' })
    ).not.toBeInTheDocument()
  })

  it('should select a department and thus change selectable categories', async () => {
    render(<Filter callback={mockCallback} />)

    expect(
      screen.getByRole('combobox', {
        name: 'Actie Service Centr...',
      })
    ).toBeInTheDocument()

    userEvent.click(
      screen.getByRole('combobox', {
        name: 'Categorie',
      })
    )

    expect(
      screen.queryByRole('option', { name: 'Bedrijfsafval' })
    ).toBeInTheDocument()

    userEvent.click(
      screen.getByRole('combobox', {
        name: 'Actie Service Centr...',
      })
    )

    userEvent.click(
      screen.getByRole('option', {
        name: 'Politie',
      })
    )

    expect(
      screen.queryByRole('combobox', { name: 'Bedrijfsafval' })
    ).not.toBeInTheDocument()

    expect(
      screen.queryByRole('combobox', { name: 'Categorie' })
    ).toBeInTheDocument()
  })

  it('should select a department and reset form by using keyboard', () => {
    render(<Filter callback={mockCallback} />)

    expect(
      screen.getByRole('combobox', {
        name: 'Actie Service Centr...',
      })
    ).toBeInTheDocument()

    screen
      .getByRole('combobox', {
        name: 'Categorie',
      })
      .focus()

    act(() => {
      fireEvent.keyDown(
        screen.getByRole('combobox', {
          name: 'Categorie',
        }),
        { code: 'Space' }
      )
    })

    screen
      .getByRole('option', {
        name: 'Bedrijfsafval',
      })
      .focus()

    expect(
      screen.getByRole('option', {
        name: 'Bedrijfsafval',
      })
    ).toBeInTheDocument()

    act(() => {
      fireEvent.keyDown(
        screen.getByRole('option', {
          name: 'Bedrijfsafval',
        }),
        { code: 'Space' }
      )
    })

    expect(
      screen.getByRole('combobox', {
        name: 'Bedrijfsafval',
      })
    ).toBeInTheDocument()

    screen
      .getByRole('button', {
        name: 'Wis filters',
      })
      .focus()

    act(() => {
      fireEvent.keyDown(
        screen.getByRole('button', {
          name: 'Wis filters',
        }),
        { code: 'Space' }
      )
    })

    expect(
      screen.queryByRole('combobox', {
        name: 'Bedrijfsafval',
      })
    ).not.toBeInTheDocument()
  })

  it('should select a department, a custom category and reset back and call callback each time', async () => {
    render(<Filter callback={mockCallback} />)

    expect(mockCallback).toBeCalledTimes(1)

    userEvent.click(
      screen.getByRole('combobox', {
        name: 'Actie Service Centr...',
      })
    )

    userEvent.click(
      screen.getByRole('option', {
        name: 'Afval en Grondstoffen',
      })
    )

    expect(mockCallback).toBeCalledTimes(2)

    expect(mockCallback).toBeCalledWith('department=AEG')

    userEvent.click(
      screen.getByRole('combobox', {
        name: 'Categorie',
      })
    )

    userEvent.click(
      screen.getByRole('option', {
        name: 'Huisafval',
      })
    )

    expect(mockCallback).toBeCalledWith('department=AEG&category=Huisafval')

    expect(mockCallback).toBeCalledTimes(3)

    expect(mockCallback).toBeCalledWith('department=ASC')

    userEvent.click(screen.getByText('Wis filters'))

    expect(mockCallback).toBeCalledTimes(3)
  })

  it('should hide department button when there is only one', () => {
    const oneDepartment = {
      ...departmentsFixture,
      list: [departmentsFixture.results[0]],
    }

    jest.spyOn(reactRedux, 'useSelector').mockReturnValue(oneDepartment)

    const { rerender } = render(<Filter callback={mockCallback} />)

    expect(
      screen.queryByRole('combobox', {
        name: 'Actie Service Centr...',
      })
    ).not.toBeInTheDocument()

    jest.spyOn(reactRedux, 'useSelector').mockReturnValue(departments)

    rerender(<Filter callback={mockCallback} />)

    expect(
      screen.queryByRole('combobox', {
        name: 'Actie Service Centr...',
      })
    ).toBeInTheDocument()
  })

  it('should tab over the comboboxes back and forth, select an option and return to last focussed combobox again', () => {
    render(<Filter callback={mockCallback} />)

    screen
      .queryByRole('combobox', {
        name: 'Actie Service Centr...',
      })
      ?.focus()

    userEvent.tab()

    userEvent.tab()

    userEvent.tab({ shift: true })

    expect(
      screen.queryByRole('combobox', {
        name: 'Categorie',
      })
    ).toHaveFocus()

    act(() => {
      fireEvent.keyDown(
        screen.getByRole('combobox', {
          name: 'Categorie',
        }),
        { code: 'Space' }
      )
    })

    expect(
      screen.queryByRole('option', {
        name: 'Asbest / accu',
      })
    ).toHaveFocus()

    act(() => {
      fireEvent.keyDown(
        screen.getByRole('option', {
          name: 'Asbest / accu',
        }),
        { code: 'ArrowDown' }
      )
    })

    expect(
      screen.queryByRole('option', {
        name: 'Auto- / scooter- / bromfiets(wrak)',
      })
    ).toHaveFocus()

    act(() => {
      fireEvent.keyDown(
        screen.getByRole('option', {
          name: 'Auto- / scooter- / bromfiets(wrak)',
        }),
        { code: 'Space' }
      )
    })
  })

  it('should open a dropdown and close it by enter Esc', () => {
    render(<Filter callback={mockCallback} />)

    act(() => {
      fireEvent.keyDown(
        screen.getByRole('combobox', {
          name: 'Actie Service Centr...',
        }),
        { code: 'Space' }
      )
    })

    expect(
      screen.queryByRole('option', { name: 'Afval en Grondstoffen' })
    ).toBeInTheDocument()

    userEvent.keyboard('{Escape}')

    expect(
      screen.queryByRole('option', { name: 'Afval en Grondstoffen' })
    ).not.toBeInTheDocument()
  })

  it('should focus on reset button, shift back and forth to end with focus on reset button', () => {
    render(<Filter callback={mockCallback} />)

    screen
      .getByRole('button', {
        name: 'Wis filters',
      })
      .focus()

    userEvent.tab({ shift: true })

    userEvent.tab()

    expect(
      screen.getByRole('button', {
        name: 'Wis filters',
      })
    ).toHaveFocus()
  })

  it('should use defaultValues from incident contexts dashboardFilter', () => {
    const mockSetDashboardFilter = jest.fn()
    render(
      <IncidentManagementContext.Provider
        value={{
          setDashboardFilter: mockSetDashboardFilter,
          dashboardFilter: {
            priority: { value: 'normal', display: 'Normaal' },
          },
        }}
      >
        <Filter callback={mockCallback} />
      </IncidentManagementContext.Provider>
    )

    expect(
      screen.getByRole('combobox', {
        name: 'Normaal',
      })
    ).toBeInTheDocument()
  })

  it('should not use defaultValues from incident contexts dashboardFilter', () => {
    jest.spyOn(reactRouterDom, 'useLocation').mockImplementation(() => ({
      hash: '',
      key: '',
      pathname: '',
      referrer: '/manage/standaard/teksten',
      search: '',
      state: null,
    }))

    const mockSetDashboardFilter = jest.fn()
    render(
      withAppContext(
        <IncidentManagementContext.Provider
          value={{
            setDashboardFilter: mockSetDashboardFilter,
            dashboardFilter: {
              priority: { value: 'normal', display: 'Normaal' },
            },
          }}
        >
          <Filter callback={mockCallback} />
        </IncidentManagementContext.Provider>
      )
    )

    expect(
      screen.queryByRole('combobox', {
        name: 'Normaal',
      })
    ).not.toBeInTheDocument()

    act(() => {
      history.push({
        pathname: '/manage/incidents',
        state: {
          useBacklink: true,
        },
      })
    })

    expect(mockSetDashboardFilter).toHaveBeenLastCalledWith({
      category: { display: '', value: '' },
      department: { display: 'Actie Service Centrum', value: 'ASC' },
      district: { display: '', value: '' },
      priority: { display: '', value: '' },
      punctuality: { display: '', value: '' },
    })

    act(() => {
      history.push({
        pathname: '/manage/incidents',
      })
    })

    expect(mockSetDashboardFilter.mock.calls[1]).toEqual([{}])
  })
})