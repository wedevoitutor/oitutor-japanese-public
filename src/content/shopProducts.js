/**
 * Shop product catalog.
 * All products are `available: false` until payment integration is complete.
 * @type {Array<{id: string, icon: string, titleKey: string, descKey: string, priceKey: string, tagKey: string, available: boolean}>}
 */
export const SHOP_PRODUCTS = [
  {
    id: 'ebook-vol-1',
    icon: '📖',
    titleKey: 'shop.products.ebook1.title',
    descKey: 'shop.products.ebook1.desc',
    priceKey: 'shop.products.ebook1.price',
    tagKey: 'shop.tags.ebook',
    available: false,
  },
  {
    id: 'ebook-vol-2',
    icon: '📗',
    titleKey: 'shop.products.ebook2.title',
    descKey: 'shop.products.ebook2.desc',
    priceKey: 'shop.products.ebook2.price',
    tagKey: 'shop.tags.ebook',
    available: false,
  },
  {
    id: 'n5-grammar',
    icon: '📝',
    titleKey: 'shop.products.n5Grammar.title',
    descKey: 'shop.products.n5Grammar.desc',
    priceKey: 'shop.products.n5Grammar.price',
    tagKey: 'shop.tags.guide',
    available: false,
  },
  {
    id: 'vocabulary',
    icon: '🗂️',
    titleKey: 'shop.products.vocabulary.title',
    descKey: 'shop.products.vocabulary.desc',
    priceKey: 'shop.products.vocabulary.price',
    tagKey: 'shop.tags.reference',
    available: false,
  },
  {
    id: 'phrasebook',
    icon: '💬',
    titleKey: 'shop.products.phrasebook.title',
    descKey: 'shop.products.phrasebook.desc',
    priceKey: 'shop.products.phrasebook.price',
    tagKey: 'shop.tags.reference',
    available: false,
  },
  {
    id: 'audio-course',
    icon: '🎧',
    titleKey: 'shop.products.audioCourse.title',
    descKey: 'shop.products.audioCourse.desc',
    priceKey: 'shop.products.audioCourse.price',
    tagKey: 'shop.tags.audio',
    available: false,
  },
];
