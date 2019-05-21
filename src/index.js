import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import withWidth from '@material-ui/core/withWidth'

import { isBreakpointActive } from './Conditional'
import Table from './Table'


class SortableTableContainer extends Component {
	constructor(props) {
		super(props)

		this.cacheListData(props.data)

		const { columnConfig, width } = props
		this.columnConfig = this.processColumnConfig(columnConfig, width)

		const listConfig = this.getListConfig(props)

		this.state = {
			data: this.getListData(listConfig), // 1-page of data
			...listConfig
		}

		// Init state-tracking flags so we can tell what changed
		const state = this.state
		this.sorting = `${state.order}_${state.orderBy}`
		this.filtering = state.filterBy || ''

		_.bindAll(this, [
			'handleRequestSort',
			'handleChangePage',
			'handleChangeRowsPerPage',
			'onClickRow'
		])
	}

	getListConfig(props) {
		const firstColumn = this.columnConfig[0] || {}

		return {
			page: props.page || 0,
			rowsPerPage: props.rowsPerPage || 5,
			filter: props.filter || '',
			filterBy: props.filterBy || '',
			order: props.order || 'asc',
			orderBy: props.orderBy || firstColumn.id || ''
		}
	}

	// noinspection JSCheckFunctionSignatures
	componentWillReceiveProps(nextProps) {
		// SKIP if there are no prop changes
		if (nextProps === this.props) return

		const { props } = this
		const { columnConfig, width, data } = nextProps

		// Update column configuration if necessary
		if (columnConfig !== props.columnConfig || width !== props.width) {
			this.columnConfig = this.processColumnConfig(columnConfig, width)
		}

		// If any config-prop is different from before, set it in state
		const nextListConfig = this.getListConfig(nextProps)
		const nextState = {}
		_.forOwn(nextListConfig, (value, key) => {
			// Compare against this.props, not calculated listConfig values
			if (nextProps[key] !== props[key]) {
				nextState[key] = value
			}
		})
		if (!_.isEmpty(nextState)) {
			this.setState(nextState)
		}

		const dataChanged = data !== this.allData
		const pageSizeChange = nextProps.rowsPerPage !== props.rowsPerPage

		// If data OR page-size changes, must reprocess list-data
		if (dataChanged || pageSizeChange) {
			this.cacheListData(data)
			this.setListData(nextListConfig, true)
		}
	}

	/**
	 * Handle conditional column params; currently only breakpoint option
	 *
	 * @param {Object} columns		Configuration passed in props
	 * @param {string} width		Width-code: 'xs, 'sm', 'med', etc.
	 * @returns {Array}				NEW array; all or some of original items
	 */
	processColumnConfig(columns, width) {
		// Validate and test breakpoint to see if current size is a match
		return _.filter(
			columns,
			column => !isBreakpointActive(column.hideIf, width)
		)
	}

	cacheListData(data) {
		this.allData = data || []
		this.filteredData = this.allData.slice()
	}

	setListData(newListConfig, forceFilterSort) {
		this.setState({
			data: this.getListData(newListConfig, forceFilterSort),
			...newListConfig
		})
	}

	getListData(newListConfig, forceFilterSort) {
		const newState = this.state ? _.clone(this.state) : {}

		if (newListConfig) {
			_.merge(newState, newListConfig)
		}

		const order = newState.order
		const orderBy = newState.orderBy

		const sorting = `${order}_${orderBy}`
		const sortChanged = sorting !== this.sorting
		if (sortChanged || forceFilterSort) {
			this.sorting = sorting

			const column = _.find(this.columnConfig, { id: orderBy }) || {}
			if (_.isFunction(column.sorter)) {
				this.allData = column.sorter(this.allData, order)
			} else {
				this.allData = _.orderBy(this.allData, orderBy, order)
			}
		}

		const filterBy = newState.filterBy
		if (sortChanged || forceFilterSort || filterBy !== this.filtering) {
			this.filtering = filterBy
			this.filterData(filterBy)
		}

		const { page, rowsPerPage } = newState

		return this.filteredData.slice(
			page * rowsPerPage,
			page * rowsPerPage + rowsPerPage
		)
	}

	filterData(filterBy) {
		if (!filterBy || _.isEmpty(filterBy)) {
			this.filteredData = _.clone(this.allData)
		} else {
			this.filteredData = _.filter(this.allData, filterBy)
		}
	}

	handleRequestSort(property) {
		const { state } = this
		const orderBy = property
		let order = 'asc'

		if (state.orderBy === property && state.order === 'asc') {
			order = 'desc'
		}

		this.setListData({ orderBy, order, page: 0 })
	}

	handleChangePage(evt, page) {
		this.setListData({ page })
	}

	handleChangeRowsPerPage(e) {
		this.setListData({ rowsPerPage: e.target.value, page: 0 })
	}

	onClickRow(id) {
		const { props } = this
		const fn = props.onClickRow
		if (fn) {
			fn(id, _.find(props.data, { [props.idField]: id }))
		}
	}

	render() {
		const { props, state } = this

		return (
			<Table
				columnConfig={this.columnConfig}
				rowLink={props.rowLink}
				idField={props.idField}
				showPagination={props.showPagination}
				paginationLocation={props.paginationLocation}
				order={state.order}
				orderBy={state.orderBy}
				data={state.data}
				pageSize={state.rowsPerPage}
				count={this.filteredData.length}
				currentPage={state.page}
				onRequestSort={this.handleRequestSort}
				onChangePage={this.handleChangePage}
				onChangeRowsPerPage={this.handleChangeRowsPerPage}
				onClickRow={this.onClickRow}
				addClass={props.addClass}
				tableInsideCard={props.tableInsideCard}
				classes={props.classes}
			/>
		)
	}
}

const {
	array,
	arrayOf,
	bool,
	func,
	oneOfType,
	number,
	shape,
	string,
	object
} = PropTypes

SortableTableContainer.propTypes = {
	width: string.isRequired, // from withWidth() HOC
	columnConfig: arrayOf(
		shape({
			id: oneOfType([number, string]).isRequired,
			label: string.isRequired,
			align: string,
			disablePadding: bool,
			hideIf: string,
			sortable: bool,
			formatter: func,
			sorter: func,
			width: string
		})
	).isRequired,
	data: array,
	page: number,
	rowsPerPage: number,
	order: string,
	orderBy: string,
	filterBy: object,
	paginationLocation: string,
	rowLink: shape({
		rootUrl: string, // path to prefix idField with
		idField: string, // fieldname in data-set; value to append to url
		external: bool, // Is an external link?
		state: object // Metadata: router.location.state
	}),
	idField: string,
	addClass: object
}

SortableTableContainer.defaultProps = {
	columnConfig: [],
	paginationLocation: 'header'
}

export default withWidth({ noSSR: true })(SortableTableContainer)
