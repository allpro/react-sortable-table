import { keys as breakpointKeys } from '@material-ui/core/styles/createBreakpoints'
import { isWidthDown, isWidthUp } from '@material-ui/core/withWidth'

const validBreakpoints = /^(xs|sm|md|lg|xl)(Up|Down)$/

/**
 * Subroutine fot testing special breakpoints like 'lgUp' and 'mdDown', etc.
 * This handles the same special codes as Material UI <Hidden />
 * This helper code is adapted from similar functionality in <Hidden />.
 *
 * @see https://material-ui.com/layout/basics/
 *
 * MUI BREAKPOINTS - defaults; ours may differ
 * -------------------------------------------
 * xs = x-small:	0px    or larger
 * sm = small:		600px  or larger
 * md = medium:		960px  or larger
 * lg = large:		1280px or larger
 * xl = x-large:	1920px or larger
 *
 * @param {string} bp       Breakpoint code to test: 'mdDown', 'lgUp', etc.
 * @param {string} width  	Breakpoint code for current screen width: 'md'
 * @returns {boolean}       Returns true if width matches, false otherwise
 */
const isBreakpointActive = (bp, width) => {
	// Validate breakpoint passed; if invalid then not a match!
	if (!bp || !validBreakpoints.test(bp)) return false

	// determine visibility based on the smallest size up
	for (const breakpoint of breakpointKeys) {
		const bpUp = bp === `${breakpoint}Up`
		const bpDn = bp === `${breakpoint}Down`

		if (
			(bpUp && isWidthUp(breakpoint, width)) ||
			(bpDn && isWidthDown(breakpoint, width))
		) {
			// The breakpoint matches
			return true
		}
	}

	// The breakpoint does NOT match
	return false
}

export default isBreakpointActive
