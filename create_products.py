import stripe
import urllib.parse
stripe.api_key = "sk_test_51N7xWEKWz42bhxUEwxn8DTw87BwXFBW9zp8FeEAnZR5y71JS6QQ0a15twkRspNUvTVynTPjIgZnrUj0YBKyrdnc700js5ste13"

#Base class for product types e.g. hoodie, bag
class BaseProduct:
    def __init__(self, id, name, description, priceCents):
        self.__id = id.lower()
        self.__name = name
        self.__description = description
        self.__defaultPriceCents = int(priceCents)
        self.__currency = 'aud'
    def getId(self):
        return self.__id
    def getName(self):
        return self.__name
    def getDescription(self):
        return self.__description
    def getDefaultPrice(self):
        return self.__defaultPriceCents
    def getCurrency(self):
        return self.__currency
# extended class with colors and size
class ProductVariant:
    def __init__(self, baseProduct, color, size, images):
        # BaseProduct Object
        self.__baseProduct = baseProduct
        # lowercase string
        self.__color = color.lower()
        # lowercase string i.e. s, m, l
        self.__size = size.lower()
        # list of image sources
        self.__images = images

    def getBaseProduct(self):
        return self.__baseProduct
    def getColor(self):
        return self.__color
    def getSize(self):
        return self.__size
    def getImages(self):
        return self.__images
    
    # get product ID type-color-size
    def getProductId(self):
        return f"{self.getBaseProduct().getId()}-{self.getColor()}-{self.getSize()}"
    
    # get product name Type (Color) - Size
    def getProductName(self):
        return f"{self.getBaseProduct().getName().title()} ({self.getColor().title()}) - {self.getSize().upper()}"
    
    # upload product to stripe
    def uploadProduct(self):
        # upload product object
        productInstance = stripe.Product.create(
            id=self.getProductId(),
            name=self.getProductName(),
            description=self.getBaseProduct().getDescription(),
            metadata={
                'product': self.getBaseProduct().getId(),
                'color':self.getColor(),
                'size':self.getSize()
            },
            images=self.getImages()
            )
        
        # upload price object
        priceInstance = stripe.Price.create(
            product=self.getProductId(),
            unit_amount=self.getBaseProduct().getDefaultPrice(),
            currency=self.getBaseProduct().getCurrency(),
            # metadata to specify base product and default pricing
            metadata={
                'product': self.getBaseProduct().getId(),
                'price-type': 'default'
                }
        )
        # setting price as default
        productInstance.modify(self.getProductId(), default_price=priceInstance['id'])

basePath = 'https://www.coopsoc.com.au/img/merch/2024/'
#urllib.parse.quote()
# crewneck%23black.png
# uploading each variant
def uploadProductVariants(baseProduct, sizesforColor):
    for color, data in sizesforColor.items():
        for size in data:
            images = [ basePath + f'{baseProduct.getId()} #{color}.png', basePath + f'{baseProduct.getId()} #{color}b.jpg']
            encodedImages = [urllib.parse.quote(image) for image in images]
            print(images)
            print(encodedImages)
            productVariant = ProductVariant(baseProduct, color, size, encodedImages)
            productVariant.uploadProduct()

defaultSizes = ['s', 'm', 'l', 'xl']
# defining product, sizes and colors
crewneck = BaseProduct('crewneck', 'Crewneck', 'Relaxed fit Mid weight, 320 GSM 80% Cotton 20% recycled polyester fleece', '4900')
crewneckColorsSizes = {
    'pine':['m','l','xl'],
    'black':defaultSizes,
    'grey':defaultSizes,
}


hoodie = BaseProduct('hoodie', 'Hoodie', 'Relaxed fit Mid weight, 320 GSM 80% Cotton 20% recycled polyester fleece', '5300')
hoodieColorsSizes = {
    'pine':['m','l','xl'],
    'black':defaultSizes,
    'grey':defaultSizes,
}

tshirt= BaseProduct('tshirt', 'T-shirt', 'Regular fit Mid weight, 180 GSM 100% combed cotton (marles 15% viscose)', '2800')
tshirtColorsSizes = {
    'pine':['m','l','xl'],
    'navy':defaultSizes,
    'cream':defaultSizes,
    'grey':defaultSizes,
}

halfzip= BaseProduct('halfzip', 'Half-Zip', 'Regular fit Heavy weight, 350 GSM 80% cotton 20% recycled polyester anti-pill fleece', '4900')
halfzipColorsSizes = {
    'powder':defaultSizes,
    'black':defaultSizes,
    'cream':defaultSizes,
}


uploadProductVariants(crewneck, crewneckColorsSizes)
uploadProductVariants(hoodie, hoodieColorsSizes)
uploadProductVariants(tshirt, tshirtColorsSizes)
uploadProductVariants(halfzip, halfzipColorsSizes)
