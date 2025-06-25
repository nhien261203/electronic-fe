export const getReturnPath = (state) => {
    if (!state) return '/admin/products?page=1'

    const { page = 1, search = '', status = '', brand = '' } = state
    const params = new URLSearchParams()

    params.set('page', page)
    if (search) params.set('search', search)
    if (status) params.set('status', status)
    if (brand) params.set('brand_id', brand)

    return `/admin/products?${params.toString()}`
}
