import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import withWidth from '@material-ui/core/withWidth'
import { keys as breakpointKeys } from '@material-ui/core/styles/createBreakpoints'

import isBreakpointActive from './isBreakpointActive'

/**
 * Multi-purpose HOC for conditional rendering of child components.
 * Accepts various criteria; ALL must match or else children will not render.
 * Most criteria accept a single string value or an array of values.
 * Accepts multiple child-components; will wrap them in a Fragment.
 *
 * Criteria props available:
 * - breakpoint		MUI breakpoint codes: 'md', 'lg', 'mdDown', 'lgUp', etc.
 * - environment	Node environment: [development|testing|production]
 * - route			Current location match, as regex or simple string
 * - state			Redux path + match value; if path is string, match = truthy
 * - condition		Custom callback function; truthy = show, falsely = hide
 */
function Conditional(props) {
	const {
		breakpoint, // breakpoint option
		condition, // condition option
		width, // width passed in by withWidth() wrapper
		children
	} = props

	let isVisible = true

	// BREAKPOINT (screen-width)
	if (isVisible && breakpoint) {
		let isVisibleTemp = false

		if (Array.isArray(breakpoint)) {
			// Check for specific breakpoints first so bail out early if match
			isVisibleTemp = breakpoint.indexOf(width) !== -1

			// If already visible, no need to perform any more tests.
			if (!isVisibleTemp) {
				for (const bp of breakpoint) {
					isVisibleTemp = isBreakpointActive(bp, width)
					if (isVisibleTemp) break // Only need to match 1 breakpoint
				}
			}
		} else {
			isVisibleTemp = breakpoint === width

			if (!isVisibleTemp) {
				isVisibleTemp = isBreakpointActive(breakpoint, width)
			}
		}

		// Update isVisible flag
		isVisible = isVisibleTemp
	}

	// CONDITION (Custom logic)
	if (isVisible && condition) {
		if (_.isFunction(condition)) {
			isVisible = condition()
		} else if (!_.isNil(condition)) {
			isVisible = !!condition
		}
	}

	return !isVisible || !children ? null : children.length <= 1 ? (
		children
	) : (
		<Fragment>{children}</Fragment>
	)
}

const { any, array, oneOfType, string } = PropTypes

Conditional.propTypes = {
	condition: any,
	breakpoint: oneOfType([string, array]),
	width: string.isRequired
}

export default withWidth()(Conditional)

// Also export helpers for use elsewhere
export { isBreakpointActive, breakpointKeys }
