/* eslint-disable camelcase */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { compose } from 'redux'
import { FormattedMessage, injectIntl } from 'react-intl'
import injectReducer from 'utils/injectReducer'
import injectSaga from 'utils/injectSaga'
import {
  Layout,
  Card,
  Row,
  Col,
  Form,
  Input,
  TreeSelect,
  Button,
  Tooltip,
  Tag,
  Typography,
} from 'antd'
import ReactTable from 'react-table'
import loGet from 'lodash/get'
import slugify from 'slug'
import validator from 'validator'

import saga from './categoriesSagas'
import { slugRule } from '../../utils/regexp'
import CategoriesActions, { reducer } from './categoriesRedux'
import UploadImage from '../../components/UploadImage'
import messages from './messages'
import { isDark } from '../../utils/helper'
import configs from '../../configures/configs'
import './categories.scss'

const TreeNode = TreeSelect.TreeNode

class Categories extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      slug: '',
      parentCategoryID: null,
      photo: '',
      categoryID: '',
      error: null,
      originalCategory: null,
      photoSelected: null,
      isEditSlug: false,
    }
  }

  componentDidMount() {
    const { getCategoriesRequest } = this.props
    getCategoriesRequest({
      parentCategoryExist: 'false',
    })
  }

  renderListCategories() {
    const { categories, isGettingCategories } = this.props
    const columns = [
      {
        Header: <FormattedMessage {...messages.No} />,
        id: "row",
        Cell: data => data.index + 1, // eslint-disable-line
        width: 60,
      },
      {
        Header: () => <FormattedMessage {...messages.Photo} />,
        accessor: 'photo',
        headerStyle: { textAlign: 'center' },
        style: { textAlign: 'center' },
        Cell: row => (
          <img // eslint-disable-line
            className="img-avatar"
            src={`${configs.SERVER_URL}/${row.value}` || null}
          >
          </img>
        ),
        width: 130,
      },
      {
        Header: <FormattedMessage {...messages.Name} />,
        accessor: 'listNameParent',
        Cell: (row) => {
          const getNameParent = () => {
            const listNameParent = row.value
            let result = listNameParent[0]
            for (let i = 1; i < listNameParent.length; i++) {
              result += ` -> ${listNameParent[i]}`
            }
            return result
          }

          const nameParent = getNameParent(nameParent)
          return (
            <div style={{ textAlign: 'justify' }}>
              {nameParent ? <div> {`${nameParent} -> `}<Tag color={loGet(row, ['original', 'color'])}>
                <Typography.Text
                  style={{
                    color: isDark(loGet(row, ['original', 'color'])) ? 'white' : 'black',
                  }}
                  strong
                >
                  {row.original.name}
                </Typography.Text>
              </Tag></div> :
                <Tag color={loGet(row, ['original', 'color'])} >
                  <Typography.Text
                    style={{
                      color: isDark(loGet(row, ['original', 'color'])) ? 'white' : 'black',
                    }}
                    strong
                  >
                    {row.original.name}
                  </Typography.Text>
                </Tag>
              }
            </div>
          )
        },
      },
      {
        Header: <FormattedMessage {...messages.Action} />,
        id: "id",
        width: 100,
        Cell: row =>
          <React.Fragment>
            <Tooltip
              placement="top"
              title={<FormattedMessage {...messages.Update} />}
            >
              <Button
                type="primary"
                icon="edit"
                className="mr-1 ml-1"
                style={{
                  backgroundColor: '#481080',
                  borderColor: '#481080',
                }}
                onClick={() => {
                  this.resetForm()
                  this.setState({
                    name: loGet(row, ['original', 'name']),
                    photo: loGet(row, ['original', 'photo']),
                    parentCategoryID: loGet(row, ['original', 'parentCategoryID']),
                    slug: loGet(row, ['original', 'slug']),
                    categoryID: loGet(row, ['original', 'id']),
                    originalCategory: row.original,
                  })
                }}
              />
            </Tooltip>
          </React.Fragment>,
      },
    ]

    const listCategories = []
    this.convertListCategories(categories, listCategories, [])

    return (
      <Card
        style={{ marginBottom: 30 }}
        title={<FormattedMessage {...messages.ListCategories} />}>
        <ReactTable
          data={listCategories}
          columns={columns}
          showPageSizeOptions={false}
          showPaginationBottom={false}
          sortable={false}
          loading={isGettingCategories}
        />
      </Card>
    )


  }

  convertListCategories(categories, listCategories, arrNameParent) {
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i]
      const listNameParent = arrNameParent.slice()
      listCategories.push(category)
      categories[i].listNameParent = listNameParent.slice()
      listNameParent.push(category.name)
      if (loGet(category, ['childrenCategories', 'length']) > 0) {
        this.convertListCategories(category.childrenCategories, listCategories, listNameParent)
      }
    }
  }


  renderTreeSelect() {
    const { categories } = this.props
    // eslint-disable-next-line camelcase
    const { parentCategoryID } = this.state

    return (
      <TreeSelect
        allowClear
        style={{ width: '100%' }}
        // eslint-disable-next-line camelcase
        value={parentCategoryID}
        placeholder={<FormattedMessage {...messages.PleaseSelectParentCategory} />}
        treeDefaultExpandAll
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        onChange={(value) => {
          this.setState({ parentCategoryID: value })
        }}
      >
        {this.renderTreeNode(categories)}
      </TreeSelect>
    )
  }

  renderTreeNode(categories) {
    const { categoryID } = this.state
    const categoriesFilter = categories.filter(item => item.id !== categoryID)

    return categoriesFilter.map(item => (<TreeNode
      value={item.id}
      title={item.name}
      key={item.id} >
      {item.childrenCategories ? this.renderTreeNode(item.childrenCategories) : null}
    </TreeNode>))
  }

  handleOnChangePhoto = (event) => {
    const { target } = event
    const { value } = target

    this.setState({
      photoSelected: value,
    })
  }

  resetForm() {
    this.setState({
      name: '',
      slug: '',
      parentCategoryID: null,
      photo: '',
      categoryID: '',
      error: null,
      originalCategory: null,
      photoSelected: null,
      isEditSlug: false,
    }, () => { this.uploadImage.resetForm() })
  }

  validateData(actionSuccess) {
    const error = {}
    const { name, photo, photoSelected, slug } = this.state

    // name
    if (validator.isEmpty(name)) {
      error.name = 'NameIsRequired'
    }
    else if (!validator.isLength(name, { min: 2, max: 100 })) {
      error.name = 'NameMustBeBetweenFrom2To100'
    }

    // photo
    if (!photo && !photoSelected) {
      error.photo = 'PhotoIsRequired'
    }

    // slug
    if (!slug) {
      error.slug = 'SlugIsRequired'
    }

    if (slug && !slugRule.test(slug)) {
      error.slug = 'SlugIsInvalid'
    }

    this.setState({ error }, () => {
      if (actionSuccess) actionSuccess()
    })
  }

  onClickCreate() {
    // eslint-disable-next-line camelcase
    const { name, photoSelected, parentCategoryID, slug, error } = this.state

    const { 
      createCategoryRequest, 
      getCategoriesRequest, 
    } = this.props

    if (error && Object.keys(error).length > 0) return
    const params = {
      name,
      photoSelected,
      // eslint-disable-next-line camelcase
      parentCategoryID: parentCategoryID || undefined,
      slug: slug || undefined,
    }

    createCategoryRequest(params, () => {
      this.resetForm()
      getCategoriesRequest({
        parentCategoryExist: 'false',
      })
    })
  }

  onClickUpdate() {
    const { name, slug, photoSelected, error,
      categoryID, originalCategory, photo } = this.state
    if (error && Object.keys(error).length > 0) return

    // eslint-disable-next-line camelcase
    const { parentCategoryID } = this.state

    const { updateCategoryRequest,
      getCategoriesRequest,
    } = this.props

    const params = {
      name,
      slug,
      parentCategoryID,
      photoSelected,
      photo,
    }

    updateCategoryRequest(categoryID, params, originalCategory, () => {
      this.resetForm()
      getCategoriesRequest({
        parentCategoryExist: 'false',
      })
    })
  }

  render() {
    const { name, photo, categoryID, error, isEditSlug } = this.state
    let { slug } = this.state
    const { intl, isCreatingCategory, isUpdatingCategory } = this.props

    return (
      <Layout className='product-categories'>
        <Helmet>
          <title>{intl.formatMessage(messages.title)}</title>
          <meta name="description" content={<FormattedMessage {...messages.title} />} />
        </Helmet>
        <Layout.Header className="app__header">
          <Button
            ghost
            loading={categoryID ? isUpdatingCategory : isCreatingCategory}
            onClick={() => this.validateData(() => {
              if (!categoryID) {
                this.onClickCreate()
                return
              }
              this.onClickUpdate()
            })}
            className="mr-1 ml-1"
            type="primary"
            style={{ fontWeight: 'bold' }}
          >{categoryID ? <FormattedMessage {...messages.Update} /> : <FormattedMessage {...messages.Create} />}</Button>
          <Button
            ghost
            onClick={() => this.resetForm()}
            type="primary"
            className="ml-1"
            style={{ fontWeight: 'bold', borderColor: '#f86c6b', color: '#f86c6b' }}
          ><FormattedMessage {...messages.Cancel} /></Button>
        </Layout.Header>
        <Layout.Content>
          <Row gutter={16}>
            <Col span={12} xl={9} lg={12} md={12} sm={24} xs={24}>
              <Card
                className="mb-4"
                title={
                  <span className="flex flex--stretch">
                    {categoryID ? <FormattedMessage {...messages.UpdateCategory} /> : <FormattedMessage {...messages.CreateCategory} />}
                  </span>
                }
              >
                <Form.Item
                  className="align-left"
                  labelCol={{ sm: 14, md: 16, lg: 16, xl: 8, xxl: 8 }}
                  wrapperCol={{ sm: 10, md: 8, lg: 8, xl: 16, xxl: 16 }}
                  label={<FormattedMessage {...messages.Name} />}
                  required
                  help={error && error.name ? <FormattedMessage {...messages[error.name]} /> : null}
                  hasFeedback={error && error.name}
                  validateStatus={!(error && error.name) ? 'success' : 'error'}
                >
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    required
                    placeholder={intl.formatMessage(messages.FillOutName)}
                    value={name}
                    onChange={(e) => {
                      const name = e.target.value
                      if (!categoryID) {
                        slug = name ? slugify(name, { lower: true }) : ''
                      }
                      this.setState({
                        name,
                        slug,
                      })
                    }}
                  />
                </Form.Item>
                <Form.Item
                  required
                  className="align-left"
                  labelCol={{ sm: 14, md: 16, lg: 16, xl: 8, xxl: 8 }}
                  wrapperCol={{ sm: 10, md: 8, lg: 8, xl: 16, xxl: 16 }}
                  label={<FormattedMessage {...messages.Slug} />}
                  help={error && error.slug ? <FormattedMessage {...messages[error.slug]} /> : null}
                  hasFeedback={error && error.slug}
                  validateStatus={!(error && error.slug) ? 'success' : 'error'}>
                  <Input
                    type="text"
                    name="slug"
                    id="slug"
                    required
                    value={slug}
                    onChange={(e) => {
                      this.setState({ slug: e.target.value })
                    }}
                    disabled={!isEditSlug}
                    suffix={(!isEditSlug) ?
                      <Tooltip title={<FormattedMessage {...messages.SlugIsUnique} />}>
                        <Button
                          icon='edit'
                          onClick={() => {
                            this.setState({ isEditSlug: true })
                          }}></Button>
                      </Tooltip> : null
                    }
                  />
                </Form.Item>
                <Form.Item
                  className="align-left"
                  labelCol={{ sm: 14, md: 16, lg: 16, xl: 8, xxl: 8 }}
                  wrapperCol={{ sm: 10, md: 8, lg: 8, xl: 16, xxl: 16 }}
                  label={<FormattedMessage {...messages.Parent} />}>
                  {this.renderTreeSelect()}
                </Form.Item>
                <Form.Item
                  className="align-left"
                  labelCol={{ sm: 14, md: 16, lg: 16, xl: 8, xxl: 8 }}
                  wrapperCol={{ sm: 10, md: 8, lg: 8, xl: 16, xxl: 16 }}
                  label={<FormattedMessage {...messages.Photo} />}
                  required
                  help={error && error.photo ? <FormattedMessage {...messages[error.photo]} /> : null}
                  validateStatus={!(error && error.photo) ? 'success' : 'error'}
                >
                  <div style={{ display: 'flex', width: '50px' }}>
                    <UploadImage
                      name='categoryPhoto'
                      image={photo ? `${configs.SERVER_URL}/${photo}` : photo}
                      onChange={this.handleOnChangePhoto}
                      onRef={ref => { this.uploadImage = ref }}
                    />
                  </div>
                </Form.Item>
              </Card>
            </Col>
            <Col span={12} xl={15} lg={12} md={12} sm={24} xs={24}>
              {this.renderListCategories()}
            </Col>
          </Row>
        </Layout.Content>
      </Layout>
    )
  }
}

Categories.propTypes = {
  categories: PropTypes.array,
  category: PropTypes.object,
  getCategoriesRequest: PropTypes.func,
  getCategoryRequest: PropTypes.func,
  isGettingCategories: PropTypes.bool,
  createCategoryRequest: PropTypes.func,
  updateCategoryRequest: PropTypes.func,
  isUpdatingCategory: PropTypes.bool,
  isCreatingCategory: PropTypes.bool,
}

const withReducer = injectReducer({ key: 'categories', reducer })
const withSaga = injectSaga({ key: 'categories', saga })

const mapStateToProps = state => {
  const categories = state.categories ? state.categories.toJS() : {}
  return {
    categories: categories.categories || [],
    category: categories.category || {},
    isGettingCategories: categories.isGettingCategories,
    isCreatingCategory: categories.isCreatingCategory,
    isUpdatingCategory: categories.isUpdatingCategory,
  }
}

const mapDispatchToProps = dispatch => ({
  getCategoriesRequest: (params, actionSuccess) =>
    dispatch(CategoriesActions.getCategoriesRequest(params, actionSuccess)),
  getCategoryRequest: (categoryID, actionSuccess) =>
    dispatch(CategoriesActions.getCategoryRequest(categoryID, actionSuccess)),
  createCategoryRequest: (params, actionSuccess) =>
    dispatch(CategoriesActions.createCategoryRequest(params, actionSuccess)),
  updateCategoryRequest: (categoryID, params, originalCategory, actionSuccess) =>
    dispatch(CategoriesActions.updateCategoryRequest(categoryID, params, originalCategory, actionSuccess)),
})

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
)

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(injectIntl(Categories))