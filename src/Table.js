import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import _ from 'lodash'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableFooter from '@material-ui/core/TableFooter'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import { withStyles } from '@material-ui/core/styles'

import Pagination from './Pagination'

const styles = theme => {
	console.log({ theme })

	const cellPaddingDesktop = '1rem'
	const cellPaddingMobile = '0.5rem 0.25rem'

	return {
		table: {}, // Can be passed in for: Table.classes.root
		row: {
			height: 'unset'
		},

		// Header & Body Cells use the same cellPadding
		cellPadding: {
			padding: cellPaddingDesktop,
			[theme.breakpoints.down('sm')]: {
				padding: cellPaddingMobile
			}
		},
		noCellPadding: {
			padding: 0
		},
		tableBodyCell: {
			verticalAlign: 'top',
			whiteSpace: 'pre-line',

			// If cells contains links then links are padded INSTEAD OF the cell
			'& > a.rowLink': {
				display: 'block',
				padding: cellPaddingDesktop,
				[theme.breakpoints.down('sm')]: {
					padding: cellPaddingMobile
				}
			},

			'&:last-child': {
				paddingRight: 'unset',
				'& > a.rowLink': {
					paddingRight: 'unset'
				}
			}
		},
		tableHeaderCell: {
			verticalAlign: 'middle'
		},

		linkStyle: {
			color: 'inherit',
			textDecoration: 'none',
			display: 'block'
		}
	}
}

const TableHeaderCell = props => {
	const { column, classes } = props
	const cellStyle = {
		width: column.width || 'auto',
		fontWeight: column.fontWeight || 'inherit',
		textAlign: column.textAlign || 'left',
		color: column.color || 'inherit'
	}

	// noinspection HtmlDeprecatedAttribute
	return (
		<TableCell
			classes={{
				root: classes.tableHeaderCell,
				head: classes.cellPadding
			}}
			style={cellStyle}
			key={column.id}
			align={column.align || 'left'}
			padding={column.disablePadding ? 'none' : 'default'}
			sortDirection={props.orderBy === column.id ? props.order : false}
		>
			{props.sortable ? (
				<TableSortLabel
					active={props.orderBy === column.id}
					direction={props.order}
					onClick={() => {
						props.onRequestSort(column.id)
					}}
					tabIndex={-1}
				>
					{column.label}
				</TableSortLabel>
			) : (
				column.label
			)}
		</TableCell>
	)
}

const TableBodyCell = props => {
	const { column, rowLink, item, classes } = props
	const { cellPadding, noCellPadding } = classes
	const link = rowLink && rowLink.rootUrl ? rowLink : false

	const cellStyle = {}
	if (item.width) cellStyle.width = item.width
	if (column.textAlign) cellStyle.textAlign = column.textAlign
	// The nowrap attribute is insufficient - also add to style
	if (column.nowrap) cellStyle.whiteSpace = 'nowrap'

	return (
		<TableCell
			classes={{
				root: classes.tableBodyCell,
				body: link ? noCellPadding : cellPadding
			}}
			style={cellStyle}
			nowrap={props.nowrap}
		>
			<LinkWrapper link={link} item={item} classes={classes}>
				{props.content}
			</LinkWrapper>
		</TableCell>
	)
}

const LinkWrapper = props => {
	const { item, link, classes } = props

	if (!link) return props.children

	const itemId = item[link.idField]
	const linkClass = `rowLink ${classes.linkStyle}`

	if (link.external) {
		return (
			<a
				href={`${link.rootUrl}${itemId}`}
				className={linkClass}
				target="_blank"
				rel="noopener noreferrer"
				tabIndex={-1}
			>
				{props.children}
			</a>
		)
	} else {
		// Use object format so can pass along location-state, if exists
		const to = {
			pathname: `${link.rootUrl}${itemId}`,
			state: link.state // may be undefined
		}
		return (
			<Link to={to} className={linkClass} tabIndex={-1}>
				{props.children}
			</Link>
		)
	}
}

/**
 * Return a custom className for a table-row IF data matches specified Criteria
 *
 * @param {object} 		item - data that comes from data.js
 * @param {object} 		classMatch: { match: { isRead: false }, className: 'b' }
 * @returns {string} 	The calculated custom class, or empty string if none
 */
const addCustomClassName = (item, classMatch) => {
	if (!classMatch || !classMatch.match) return ''

	const addClassCriteria = classMatch.match
	const customClassName = classMatch.className || ''

	let match = true

	_.forOwn(addClassCriteria, (value, key) => {
		if (item[key] !== value) {
			match = false
		}
	})

	return match ? customClassName : ''
}

const format = (value, formatter, item) => (
	formatter ? formatter(value, item) : value
)


const SortableTable = props => {
	const { classes } = props
	const idField = props.idField

	return (
		<Fragment>
			<Table classes={{ root: classes.table }}>
				<TableHead>
					<TableRow classes={{ root: classes.row }}>
						{props.columnConfig.map(column => (
							<TableHeaderCell
								key={column.id}
								column={column}
								sortable={column.sortable}
								orderBy={props.orderBy}
								order={props.order}
								onRequestSort={props.onRequestSort}
								classes={classes}
							/>
						))}
					</TableRow>
				</TableHead>

				<TableBody>
					{props.data.map((item, index) => (
						<TableRow
							classes={{
								root: classnames(
									classes.row,
									addCustomClassName(item, props.addClass)
								)
							}}
							key={item[idField] || index}
							hover
							onClick={() => {
								props.onClickRow(item[idField])
							}}
						>
							{props.columnConfig.map(column => (
								<TableBodyCell
									key={column.id}
									column={column}
									columnId={column.id}
									content={format(item[column.id], column.formatter, item)}
									item={item}
									rowLink={props.rowLink}
									nowrap={column.nowrap ? 'nowrap' : ''}
									classes={classes}
								/>
							))}
						</TableRow>
					))}
				</TableBody>

				{props.showPagination &&
					props.paginationLocation === 'footer' && (
						<TableFooter>
							<TableRow>
								<TableCell colSpan="99" padding="none">
									<Pagination {...props} />
								</TableCell>
							</TableRow>
						</TableFooter>
					)}
			</Table>

			<Pagination {...props} />
		</Fragment>
	)
}

const {
	array,
	arrayOf,
	bool,
	func,
	number,
	object,
	oneOfType,
	shape,
	string
} = PropTypes

SortableTable.propTypes = {
	tableInsideCard: bool, // default = true for back-compat
	onRequestSort: func,
	onClickRow: func,
	order: string,
	orderBy: string,
	columnConfig: arrayOf(
		shape({
			id: oneOfType([number, string]),
			align: string,
			disablePadding: bool,
			label: string,
			nowrap: bool,
			sortable: bool,
			formatter: func,
			width: string
		})
	),
	rowLink: shape({
		rootUrl: string, // path to prefix idField with
		idField: string, // fieldname in data-set; value to append to url
		external: bool, // Is an external link?
		state: object // Metadata: router.location.state
	}),
	data: array,
	showPagination: bool,
	sortable: bool,
	classes: object
}

SortableTable.defaultProps = {
	tableInsideCard: true, // default = true for back-compat
	showPagination: false,
	sortable: false
}

export default withStyles(styles)(SortableTable)
