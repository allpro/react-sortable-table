import React from 'react'
import { render } from 'react-dom'

import DemoLayout from '@allpro/demo-layout'

import App from './App'

function SortableTableDemo() {
	return (
		<DemoLayout
			packageName="react-sortable-table"
			title="React SortableTable Examples"
			readme="https://github.com/allpro/react-sortable-table/blob/master/README.md"
			demo="https://codesandbox.io/s/github/allpro/react-sortable-table/tree/master/example"
			pages={[
				{
					label: 'First Demo',
					path: '/demo',
					component: App
				}
			]}
		/>
	)
}

render(<SortableTableDemo />, document.getElementById('root'))
