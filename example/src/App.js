import React, { Fragment } from 'react'
import { withRouter } from 'react-router-dom'

import SortableTable from '@allpro/react-sortable-table'

// import { formatters } from 'helpers'
import data from './data'

const SortableTableDemo = props => {
	const rowLink = {
		rootUrl: `${props.match.url}/details/`,
		idField: 'caseId'
	}

	// const sampleFilter = { status: 'Submitted' }
	const sampleSorting = { orderBy: 'status', order: 'desc' }

	// const formatDate = formatters.formatDate
	// const dateFormatter = date =>
	// 	`${formatDate(date, 'short-date')}\n${formatDate(date, '', 'medium-time')}`

	const caseTypeFormatter = (categoryName, item) => {
		// STYLE 1 - return a simple string with a line-break
		// return `${categoryName}\n - ${item.sub_category_name}`;

		// STYLE 2 - return a component - allows custom formatting
		return (
			<Fragment>
				<div>{categoryName}</div>
				<div> - {item.sub_category_name}</div>
			</Fragment>
		)
	}

	// Config copied from components/MyVoice/MyVoice_Submissions/index.js
	const columnConfig = [
		{
			id: 'updated_at',
			align: 'left',
			disablePadding: false,
			label: 'Updated',
			width: '7em',
			sortable: true
			// formatter: dateFormatter
		},
		{
			id: 'code',
			align: 'left',
			disablePadding: false,
			label: 'Case ID',
			width: '16em',
			sortable: false
		},
		{
			id: 'type_name',
			align: 'left',
			disablePadding: false,
			label: 'Case Type',
			sortable: false,
			formatter: caseTypeFormatter
		},
		{
			id: 'status_name',
			align: 'left',
			disablePadding: false,
			label: 'Status',
			sortable: true,
			nowrap: true,
			width: '11em'
		}
	]

	return (
		<SortableTable
			headerTitle="Header Title"
			rowLink={rowLink}
			columnConfig={columnConfig}
			rowsPerPage={5}
			showPagination={true}
			data={data}
			idField="id"
			{...sampleSorting}
		/>
	)
}

export default withRouter(SortableTableDemo)
