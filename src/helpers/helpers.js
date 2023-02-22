import { AES } from 'crypto-js'

export const generateCategoriesList = (categories, isCategory = false) => {
    return categories
        ? isCategory
            ? [
                  { value: 0, label: 'Glavniy kategoriya' },
                  ...categories?.map((item) => {
                      return {
                          value: item.id,
                          label: item.name_uz ? item.name_uz : item.value_uz,
                      }
                  }),
              ]
            : [
                  ...categories?.map((item) => {
                      return {
                          value: item.id,
                          label: item.name_uz ? item.name_uz : item.value_uz,
                      }
                  }),
              ]
        : []
}

export const catchSelectedCategory = (list, id) => {
    const a = {}
    if (list) {
        for (const item of list) {
            if (item.id === id) {
                a.label = item.name_uz
                a.value = item.id
            }
        }
    }

    return a
}

export const deleteProps = (obj, arr) => {
    const newObj = structuredClone(obj)
    for (const el in newObj) {
        if (arr.includes(el)) {
            delete newObj[el]
        }
    }

    return newObj
}

export function slugify(text) {
    const from = 'ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;'
    const to = 'aaaaaeeeeeiiiiooooouuuunc------'

    const newText = text
        .split('')
        .map((letter, i) =>
            letter.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
        )

    return newText
        .toString() // Cast to string
        .toLowerCase() // Convert the string to lowercase letters
        .trim() // Remove whitespace from both sides of a string
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/&/g, '-y-') // Replace & with 'and'
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
}

export const getEncryptedCode = () => {
    return AES.encrypt(
        JSON.stringify({
            client: 'ecommerce',
            secret: 'gCosGwTqCNCpIoGnS28V7TfD2V0obDbPaJSY6LvmN7Lg0XPl5Rt6ne9vdbwL+Q',
            time: Date.now(),
        }),
        'G2DPdL0RN2ldSRuKpnWSRlfZrzBBEtc0qhZ+xQaRjjdTZdV89bausl1KR6l1SkqY'
    ).toString()
}

export const productErrorMessages = {
    name_uz: 'uzbekcha nomi',
    name_ru: 'ruscha nomi',
    description_uz: 'uzbekcha tasnifi',
    description_ru: 'ruscha tasnifi',
    category_id: 'kategoriya',
    brand_id: 'brand',
    quantity: 'soni',
    previous_price: 'avvalki narxi',
    price: 'narxi',
    images: 'rasm',
    discount: 'chegirma',
}

export const paymentMethod = {
    0: 'Наличный',
    1: 'Click',
    2: 'Payme',
}