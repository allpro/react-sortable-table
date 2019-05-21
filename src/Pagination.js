import React from 'react'
import PropTypes from 'prop-types'

import TablePagination from '@material-ui/core/TablePagination'

const Pagination = props => {
	const showPerPage = false

	return (
		<TablePagination
			count={props.count}
			rowsPerPage={props.pageSize}
			rowsPerPageOptions={showPerPage ? undefined : []}
			page={props.currentPage}
			backIconButtonProps={{
				'aria-label': 'Previous Page'
			}}
			nextIconButtonProps={{
				'aria-label': 'Next Page'
			}}
			onChangePage={props.onChangePage}
			onChangeRowsPerPage={props.onChangeRowsPerPage}
			component="div"
		/>
	)
}

const { func, number } = PropTypes
Pagination.propTypes = {
	onChangePage: func.isRequired,
	onChangeRowsPerPage: func.isRequired,
	count: number,
	pageSize: number,
	currentPage: number
}

export default Pagination
