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
  Typography,
  Tooltip,
} from 'antd'
import numeral from 'numeral'
import loGet from 'lodash/get'
import validator from 'validator'
import uuidv1 from 'uuid/v1'
import R from 'ramda'
import slugify from 'slug'

import saga from './productSagas'
import ProductActions, { reducer } from './productRedux'
import UploadImage from '../../components/UploadImage'
import TextEditor from '../../components/TextEditor'
import messages from './messages'
import { slugRule } from '../../utils/regexp'
import './product.scss'


const TreeNode = TreeSelect.TreeNode

const INITIAL_STATE = {
  productID: '',
  name: '',
  mainPhoto: '',
  subPhotos: [],
  quantity: 0,
  description: '',
  categoryIDs: [],
  price: '',
  error: null,
  priceDisplay: '',
  mainPhotoSelected: null,
  subPhotosSelected: [],
  originalProduct: {},
  numSecondaryPhotos: 0,
  slug: '',
  isEditSlug: false,
  barcode: '',
}

class Product extends Component {
  constructor(props) {
    super(props)
    this.state = INITIAL_STATE

    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount() {
    const { getCategoriesRequest, getProductRequest } = this.props
    const productID = R.path(
      ['match', 'params', 'productID'],
      this.props,
    )
    getCategoriesRequest({
      parentCategoryExist: 'false',
    })
    if (productID) {
      getProductRequest(productID, (product) => {
        const categoryIDs = product.categories ?
          product.categories.map(item => item.id) : []
        this.setState({
          ...product,
          productID: product.id,
          categoryIDs,
          originalProduct: product,
          priceDisplay: numeral(product.price).format('0,0'),
          numSecondaryPhotos: loGet(product, ['subPhotos', 'length'], 0),
        })
      })
    }
  }

  validateData(actionSuccess) {
    const error = {}
    const {
      name,
      mainPhoto,
      subPhotos,
      subPhotosSelected,
      mainPhotoSelected,
      quantity,
      categoryIDs,
      price,
      slug,
    } = this.state

    if (validator.isEmpty(name)) {
      error.name = 'NameIsRequired'
    }
    else if (!validator.isLength(name, { min: 2, max: 100 })) {
      error.name = 'NameMustBeBetweenFrom2To100'
    }

    if (!mainPhoto && !mainPhotoSelected) {
      error.mainPhoto = 'MainPhotoIsRequired'
    }

    if (subPhotos.length > 3 || subPhotosSelected.length > 3) {
      error.subPhotos = 'MaxSecondaryPhotos'
    }

    if (quantity < 0) {
      error.quantity = 'InvalidQuantity'
    }

    if (!price) {
      error.price = 'PriceIsRequired'
    }

    if (price < 0) {
      error.price = 'InvalidPrice'
    }

    if (categoryIDs.length <= 0) {
      error.categories = 'CategoriesIsRequired'
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

  renderTreeSelectCategories() {
    const { categoryIDs } = this.state
    const { categories } = this.props
    return (
      <TreeSelect
        multiple
        allowClear
        style={{ width: '100%' }}
        value={categoryIDs}
        placeholder={<FormattedMessage {...messages.PleaseSelectCategory} />}
        treeDefaultExpandAll
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        onChange={(value) => {
          this.setState({ categoryIDs: value })
        }}
      >
        {this.renderTreeNodeCategories(categories)}
      </TreeSelect>
    )
  }

  renderTreeNodeCategories(categories) {
    return categories.map(item => (<TreeNode
      value={item.id}
      title={item.name}
      key={item.id} >
      {item.childrenCategories ? this.renderTreeNodeCategories(item.childrenCategories) : null}
    </TreeNode>))
  }

  handleOnChangeMoney = (e) => {
    let {
      priceDisplay,
      price,
    } = this.state
    let { value } = e.target

    value = value ? parseInt(value.replace(/\,|-/g, '')) : '' // eslint-disable-line
    price = value
    priceDisplay = numeral(value).format('0,0')

    this.setState({ price, priceDisplay })
  }

  handleOnChangePhoto = (event) => {
    const { target } = event
    const { value } = target

    this.setState({
      mainPhotoSelected: value,
    })
  }

  uploadSecondaryPhotos = {}

  mapSecondaryPhotos = (photo) => (
    <Col
      span={12}
      className="pb-4 flex justify-content-center"
      style={{ flexDirection: 'column' }}
      key={photo.id}>
      <UploadImage
        name={photo.id}
        image={photo.url}
        onChange={this.handleOnChangeSecondalyPhotos}
        onRef={ref => { this.uploadSecondaryPhotos[photo.id] = ref }}
      />
      <Button
        onClick={() => this.handleRemoveSecondaryPhotos(photo.id)}
        type="danger"
        className="mt-2"
      >
        <i className="fa fa-trash" />
      </Button>
    </Col>
  )

  handleRemoveSecondaryPhotos = (id) => {
    const { subPhotos, subPhotosSelected, numSecondaryPhotos } = this.state
    // Handle map photos
    const idxPhotos = subPhotos.findIndex(photo => photo.id === id)
    subPhotos.splice(idxPhotos, 1)
    // Handle remove data
    const idxSelectedFile = subPhotosSelected.findIndex(
      data => data.name === id,
    )
    if (idxSelectedFile > -1) subPhotosSelected.splice(idxSelectedFile, 1)
    delete this.uploadSecondaryPhotos[id]
    this.setState({
      subPhotos,
      subPhotosSelected,
      numSecondaryPhotos: numSecondaryPhotos - 1,
    })
  }

  handleAddMoreSecondaryPhotos = () => {
    const { subPhotos, numSecondaryPhotos } = this.state
    subPhotos.push({
      url: '',
      id: uuidv1(),
    })
    this.setState({
      numSecondaryPhotos: numSecondaryPhotos + 1,
      subPhotos,
    })
  }

  handleOnChangeSecondalyPhotos = (event) => {
    const { subPhotosSelected } = this.state
    const { target } = event
    const { value, name } = target
    const idx = subPhotosSelected.findIndex(data => data.name === name)
    if (value) {
      if (idx === -1) subPhotosSelected.push(target)
      else {
        subPhotosSelected.splice(idx, 1, target)
      }
    } else {
      subPhotosSelected.splice(idx, 1)
    }
    this.setState({
      subPhotosSelected,
    })
  }

  resetForm() {
    this.setState({
      ...INITIAL_STATE,
    }, () => {
      this.uploadMainPhoto.resetForm()
      Object.keys(this.uploadSecondaryPhotos).forEach(item => {
        this.uploadSecondaryPhotos[item].resetForm()
      })
      this.uploadSecondaryPhotos = []
    })
  }

  onSubmit() {
    const { productID,
      name,
      mainPhoto,
      subPhotos,
      quantity,
      description,
      categoryIDs,
      price,
      mainPhotoSelected,
      subPhotosSelected,
      originalProduct,
      slug,
      barcode,
    } = this.state

    const { createProductRequest, updateProductRequest } = this.props

    const params = {
      name,
      mainPhoto,
      mainPhotoSelected,
      subPhotos,
      subPhotosSelected,
      quantity,
      description,
      categoryIDs,
      price,
      slug: slug || undefined,
      barcode,
    }

    if (!productID) {
      createProductRequest(params, () => this.resetForm())
      return
    }
    updateProductRequest(productID, params, originalProduct)
  }

  render() {
    const { productID,
      name,
      mainPhoto,
      subPhotos,
      quantity,
      description,
      priceDisplay,
      numSecondaryPhotos,
      error,
      isEditSlug,
      barcode,
    } = this.state
    let { slug } = this.state
    const { intl, history, isCreatingProduct, isUpdatingProduct } = this.props

    return (
      <Layout className="animated fadeIn app product" style={{ paddingBottom: '20px' }}>
        <Helmet>
          {
            productID
              ? <title>
                {intl.formatMessage(messages.UpdateProduct)}
              </title>
              : <title>
                {intl.formatMessage(messages.CreateProduct)}
              </title>
          }
          <meta
            name="description"
            content={intl.formatMessage(messages.Product)}
          />
        </Helmet>
        <Layout.Header>
          <Row>
            <Col span={24} style={{ marginBottom: '20px' }} >
              <div className="app__headerButton">
                <Button
                  type="primary"
                  loading={productID ? isUpdatingProduct : isCreatingProduct}
                  onClick={() => {
                    this.validateData(() => {
                      const { error } = this.state
                      if (error && Object.keys(error).length > 0) return
                      this.onSubmit()
                    })
                  }}
                  ghost
                  className="mr-1 ml-1"
                  style={{ fontWeight: 'bold' }}
                >
                  {productID ? <FormattedMessage {...messages.Update} /> : <FormattedMessage {...messages.Create} />}
                </Button>
                <Button
                  ghost
                  type="primary"
                  className="ml-1"
                  style={{ fontWeight: 'bold', borderColor: '#f86c6b', color: '#f86c6b' }}
                  disabled={productID ? isUpdatingProduct : isCreatingProduct}
                  onClick={() => {
                    history.goBack()
                  }}
                >
                  <FormattedMessage {...messages.Cancel} />
                </Button>
              </div>
            </Col>
          </Row>
        </Layout.Header>
        <Layout.Content>
          <Row gutter={16}>
            <Col span={13} xs={24} sm={24} md={12} lg={12}>
              <Card title={<FormattedMessage {...messages.Product} />} type="inner">
                {/* name */}
                <Row gutter={24}>
                  <Col span={24} md={24} lg={24} xs={24} sm={12}>
                    <Form>
                      <label span={24} style={{ marginLeft: '12px' }}>
                        <FormattedMessage {...messages.Name} />
                        <span className="text-danger"> *</span>
                      </label>
                      <Col span={24}>
                        <Form.Item
                          help={error && error.name ?
                            <FormattedMessage {...messages[error.name]} />
                            : null}
                          required
                          hasFeedback={error && error.name}
                          validateStatus={!(error && error.name) ? 'success' : 'error'}
                        >
                          <Input
                            id="name"
                            name="name"
                            defaultValue={name}
                            value={name}
                            onChange={e => {
                              const name = e.target.value
                              if (!productID) {
                                slug = name ? slugify(name, { lower: true }) : ''
                              }
                              this.setState({
                                name,
                                slug,
                              })
                            }
                            }
                          />
                        </Form.Item>
                      </Col>
                    </Form>
                  </Col>
                </Row>
                {/* slug */}
                <Row gutter={24}>
                  <Col span={24} md={24} lg={24} xs={24} sm={12}>
                    <Form>
                      <label span={24} style={{ marginLeft: '12px' }}>
                        <FormattedMessage {...messages.Slug} />
                        <span className="text-danger"> *</span>
                      </label>
                      <Col span={24}>
                        <Form.Item
                          className="align-left"
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
                      </Col>
                    </Form>
                  </Col>
                </Row>
                {/* categories */}
                <Row gutter={16}>
                  <Col span={12} md={24} lg={24} xs={24} sm={12}>
                    <Form >
                      <label span={24} style={{ marginLeft: '12px' }}>
                        <FormattedMessage {...messages.Categories} />
                        <span className="text-danger"> *</span>
                      </label>
                      <Col span={24}>
                        <Form.Item
                          help={error && error.categories
                            ? <FormattedMessage {...messages[error.categories]} />
                            : null}
                          required
                          hasFeedback={error && error.categories}
                          validateStatus={!(error && error.categories) ? 'success' : 'error'}
                        >
                          {this.renderTreeSelectCategories()}
                        </Form.Item>
                      </Col>
                    </Form>
                  </Col>
                </Row>
                {/* barcode */}
                <Row gutter={16}>
                  <Col span={12} md={24} lg={24} xs={24} sm={12}>
                    <Form >
                      <label span={24} style={{ marginLeft: '12px' }}>
                        <FormattedMessage {...messages.Barcode} />
                      </label>
                      <Col span={24}>
                        <Form.Item
                          className="align-left">
                          <Input
                            type="text"
                            name="barcode"
                            id="barcode"
                            value={barcode}
                            onChange={(e) => {
                              this.setState({ barcode: e.target.value })
                            }}
                          />
                        </Form.Item>
                      </Col>
                    </Form>
                  </Col>
                </Row>
                <Row gutter={16}>
                  {/* price */}
                  <Col span={12} md={12} lg={12} xs={24} sm={12}>
                    <Form >
                      <label span={24} style={{ marginLeft: '12px' }}>
                        <FormattedMessage {...messages.Price} />
                        <span className="text-danger"> *</span>
                      </label>
                      <Col span={24}>
                        <Form.Item
                          help={error && error.price
                            ? <FormattedMessage {...messages[error.price]} />
                            : null}
                          validateStatus={!(error && error.price) ? 'success' : 'error'}
                        >
                          <Input
                            style={{ width: '100%' }}
                            value={priceDisplay}
                            suffix={<Typography.Text strong style={{ color: 'rgba(0,0,0,.25)' }}>VND</Typography.Text>}
                            onChange={e => this.handleOnChangeMoney(e)}
                          />
                        </Form.Item>
                      </Col>
                    </Form>
                  </Col>
                  {/* quantity */}
                  <Col span={12} md={12} lg={12} xs={24} sm={12}>
                    <Form >
                      <label span={24} style={{ marginLeft: '12px' }}>
                        <FormattedMessage {...messages.Quantity} />
                      </label>
                      <Col span={24}>
                        <Form.Item
                          help={error && error.quantity
                            ? <FormattedMessage {...messages[error.quantity]} />
                            : null}
                          hasFeedback={error && error.quantity}
                          validateStatus={!(error && error.quantity) ? 'success' : 'error'}
                        >
                          <Input
                            type="number"
                            min={0}
                            style={{ width: '100%' }}
                            value={quantity}
                            onChange={e => { this.setState({ quantity: e.target.value }) }}
                            disabled
                          />
                        </Form.Item>
                      </Col>
                    </Form>
                  </Col>
                </Row>
                {/* main photo */}
                <Form>
                  <Col span={24} md={24} lg={24} xs={24} sm={24}>
                    <label>
                      <FormattedMessage {...messages.MainPhoto} />
                      <span className="text-danger"> *</span>
                    </label>
                  </Col>
                  <Col
                    span={24} md={24} lg={24} xs={24} sm={24}
                    className="pb-4 flex flex--center">
                    <Form.Item
                      help={error && error.mainPhoto ? <FormattedMessage {...messages[error.mainPhoto]} /> : null}
                      required
                      validateStatus={!(error && error.mainPhoto) ? 'success' : 'error'}
                    >
                      <UploadImage
                        name='mainPhoto'
                        image={mainPhoto}
                        onChange={this.handleOnChangePhoto}
                        onRef={ref => { this.uploadMainPhoto = ref }}
                      />
                    </Form.Item>
                  </Col>
                </Form>
                {/* secondary photos */}
                <Form>
                  <Col span={24} md={24} lg={24} xs={24} sm={24}>
                    <label>
                      <FormattedMessage {...messages.SecondaryPhotos} />
                    </label>
                  </Col>
                  <Col
                    span={24} md={24} lg={24} xs={24} sm={24}
                    className="pb-4 flex flex--center">
                    <Form.Item
                      help={error && error.image ? <FormattedMessage {...messages[error.subPhotos]} /> : null}
                      required
                      validateStatus={!(error && error.image) ? 'success' : 'error'}
                    >
                      <Row className="d-flex justify-content-center flex-wrap" gutter={24}>
                        {subPhotos.map(this.mapSecondaryPhotos)}
                      </Row>

                      {numSecondaryPhotos < 3 ?
                        <Col
                          className="pb-4 flex flex--center">
                          <Button
                            type="primary"
                            onClick={this.handleAddMoreSecondaryPhotos}
                          >
                            <i className="fa fa-plus" />
                          </Button>
                        </Col> : null
                      }
                    </Form.Item>
                  </Col>
                </Form>
              </Card>
            </Col>

            <Col span={11} xs={24} sm={24} md={12} lg={12} className="app__editor">
              <Card
                type="inner"
                title={<FormattedMessage {...messages.Description} />}
                cover={
                  <TextEditor
                    id="1"
                    onRef={(ref) => { this.editor = ref }}
                    value={description}
                    onChange={(value) => this.setState({ description: value })}
                  />
                }
                bodyStyle={{ padding: '0' }}
              >
              </Card>
              <br />
            </Col>
          </Row>
        </Layout.Content>
      </Layout>
    )
  }
}

Product.propTypes = {
  product: PropTypes.object,
  getProductRequest: PropTypes.func,
  isGettingProduct: PropTypes.bool,
  createProductRequest: PropTypes.func,
  updateProductRequest: PropTypes.func,
  isUpdatingProduct: PropTypes.bool,
  isCreatingProduct: PropTypes.bool,
  getCategoriesRequest: PropTypes.func,
  categories: PropTypes.array,
}

const withReducer = injectReducer({ key: 'product', reducer })
const withSaga = injectSaga({ key: 'product', saga })

const mapStateToProps = state => {
  const product = state.product ? state.product.toJS() : {}
  return {
    product: product.product || {},
    isGettingProduct: product.isGettingProduct,
    isCreatingProduct: product.isCreatingProduct,
    isUpdatingProduct: product.isUpdatingProduct,
    categories: product.categories || [],
  }
}

const mapDispatchToProps = dispatch => ({
  getProductRequest: (productID, actionSuccess) =>
    dispatch(ProductActions.getProductRequest(productID, actionSuccess)),
  createProductRequest: (params, actionSuccess) =>
    dispatch(ProductActions.createProductRequest(params, actionSuccess)),
  updateProductRequest: (productID, params, originalProduct, actionSuccess) =>
    dispatch(ProductActions.updateProductRequest(productID, params, originalProduct, actionSuccess)),
  getCategoriesRequest: (params, actionSuccess) =>
    dispatch(ProductActions.getCategoriesRequest(params, actionSuccess)),
})

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
)

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(injectIntl(Product))