import { Collapse, Row, Spin } from "antd"
import React from "react"
import PageHeader from "../components/PageHeader"
import { categoriesListUrl } from "../helpers/url"
import { useLoad } from '../hooks/request'

const  { Panel } = Collapse

function Categories() {
  const { loading, response } = useLoad({url: categoriesListUrl})
  return <>
      <PageHeader title='Categories' btnTitle='Add category'/> 

      {
        loading ? (<Spin/>) : (
          <Row className="container">
        <Collapse defaultActiveKey={['1']}>
            {
              response?.categories?.map((item) => (
                <Panel header={item.name_uz} key={item.id}>
                    <p>Item content</p>
                </Panel>
              )) 
            }
      </Collapse>
        </Row>
        )
      }
  </>
}

export default Categories

// passwordforusername1