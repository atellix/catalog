export interface AbstractProperty {
    uri: string;
    type: string;
    isArray?: boolean;
    isOptional?: boolean;
    isMultiType?: boolean;
}

export interface AbstractDefinition {
    uri: string;
    name: string;
    extends?: string;
    properties: { [key: string]: AbstractProperty };
    propertyUris: { [key: string]: string };
}

export type AbstractDefinitionMap = { [key: string]: AbstractDefinition }

function buildDefinitions(typeData: any[]): AbstractDefinition[] {
    var defs: AbstractDefinition[] = []
    for (var i = 0; i < typeData.length; i++) {
        const item = typeData[i]
        if (item.length > 2) {
            defs.push(buildDefinition(item[0], item[1], propData[item[0]], item[2]))
        } else {
            defs.push(buildDefinition(item[0], item[1], propData[item[0]]))
        }
    }
    return defs
}

function buildDefinition(typeName: string, typeUri: string, properties: { [key: string]: AbstractProperty }, extendsType: string = ''): AbstractDefinition {
    var propuris: { [key: string]: string } = {}
    Object.entries(properties).forEach(([key, value]) => {
        propuris[value.uri] = key
    })
    var def: AbstractDefinition = {
        uri: typeUri,
        name: typeName,
        properties: properties,
        propertyUris: propuris,
    }
    if (extendsType) {
        def.extends = extendsType
    }
    return def
}

function mapDefinitions(defs: AbstractDefinition[]): AbstractDefinitionMap {
    var mapDefs: AbstractDefinitionMap = {}
    for (var i = 0; i < defs.length; i++) {
        mapDefs[defs[i].name] = defs[i]
    }
    return mapDefs
}

function addProperty(props: { [key: string]: AbstractProperty }, data: any[]) {
    var typeInfo = data[1]
    var multiType = false
    if (Array.isArray(typeInfo)) {
        typeInfo = typeInfo.join(' | ')
        multiType = true
    }
    var prop: AbstractProperty = props[data[0]] = {
        type: typeInfo,
        uri: data[2],
        isMultiType: multiType,
    }
    if (data[3]) {
        prop.isArray = true
    }
    if (data[4]) {
        prop.isOptional = true
    }
}

function SKOS(urlPart: string) { return 'http://www.w3.org/2004/02/skos/core#' + urlPart }
function SCH(urlPart: string) { return 'http://schema.org/' + urlPart }
function ATX(urlPart: string) { return 'http://rdf.atellix.net/1.0/schema/catalog/' + urlPart }

var typeData: any[] = [];
var propData: { [key: string]: { [key: string]: AbstractProperty } } = {}

// Array Elements: Name, Type, PropertyURI, IsArray, IsOptional

typeData.push(['IThing', SCH('Thing'), 'IObject'])
propData['IThing'] = {}
addProperty(propData['IThing'], ['uuid', 'string', ATX('Object.uuid'), false, true])
addProperty(propData['IThing'], ['name', 'string', SCH('name'), false, true])
addProperty(propData['IThing'], ['identifier', 'string', SCH('identifier'), false, true])
addProperty(propData['IThing'], ['additionalType', 'IThing', SCH('additionalType'), true, true])
addProperty(propData['IThing'], ['alternateName', 'string', SCH('alternateName'), true, true])
addProperty(propData['IThing'], ['description', 'string', SCH('description'), false, true])
addProperty(propData['IThing'], ['image', 'IMediaObject', SCH('image'), true, true])
addProperty(propData['IThing'], ['url', 'string', SCH('url'), false, true])
addProperty(propData['IThing'], ['sameAs', 'IThing', SCH('sameAs'), true, true])
addProperty(propData['IThing'], ['subjectOf', 'IThing', SCH('subjectOf'), true, true])
addProperty(propData['IThing'], ['mainEntityOfPage', 'IThing', SCH('mainEntityOfPage'), true, true])
addProperty(propData['IThing'], ['potentialAction', 'IAction', SCH('potentialAction'), true, true])

typeData.push(['IAction', SCH('Action'), 'IThing'])
propData['IAction'] = {}
addProperty(propData['IAction'], ['actionStatus', 'IThing', SCH('actionStatus'), false, true])
addProperty(propData['IAction'], ['agent', ['IOrganization', 'IPerson'], SCH('agent'), false, true])
addProperty(propData['IAction'], ['startTime', 'Date', SCH('startTime'), false, true])
addProperty(propData['IAction'], ['endTime', 'Date', SCH('endTime'), false, true])
addProperty(propData['IAction'], ['error', 'IThing', SCH('error'), false, true])
addProperty(propData['IAction'], ['instrument', 'IThing', SCH('instrument'), false, true])
addProperty(propData['IAction'], ['location', 'IPlace', SCH('location'), false, true])
addProperty(propData['IAction'], ['object', 'IThing', SCH('object'), false, true])
addProperty(propData['IAction'], ['participant', ['IOrganization', 'IPerson'], SCH('participant'), false, true])
addProperty(propData['IAction'], ['object', 'IThing', SCH('object'), false, true])
addProperty(propData['IAction'], ['result', 'IThing', SCH('result'), false, true])
addProperty(propData['IAction'], ['target', 'IThing', SCH('target'), false, true])

typeData.push(['IAchieveAction', SCH('AchieveAction'), 'IAction'])
propData['IAchieveAction'] = {}

typeData.push(['ILoseAction', SCH('LoseAction'), 'IAction'])
propData['ILoseAction'] = {}

typeData.push(['ITieAction', SCH('TieAction'), 'IAction'])
propData['ITieAction'] = {}

typeData.push(['IWinAction', SCH('WinAction'), 'IAction'])
propData['IWinAction'] = {}

typeData.push(['IAssessAction', SCH('AssessAction'), 'IAction'])
propData['IAssessAction'] = {}

typeData.push(['IChooseAction', SCH('ChooseAction'), 'IAction'])
propData['IChooseAction'] = {}

typeData.push(['IIgnoreAction', SCH('IgnoreAction'), 'IAction'])
propData['IIgnoreAction'] = {}

typeData.push(['IReactAction', SCH('ReactAction'), 'IAction'])
propData['IReactAction'] = {}

typeData.push(['IReviewAction', SCH('ReviewAction'), 'IAction'])
propData['IReviewAction'] = {}

typeData.push(['IAgreeAction', SCH('AgreeAction'), 'IAction'])
propData['IAgreeAction'] = {}

typeData.push(['IDisagreeAction', SCH('DisagreeAction'), 'IAction'])
propData['IDisagreeAction'] = {}

typeData.push(['IDislikeAction', SCH('DislikeAction'), 'IAction'])
propData['IDislikeAction'] = {}

typeData.push(['IEndorseAction', SCH('EndorseAction'), 'IAction'])
propData['IEndorseAction'] = {}

typeData.push(['ILikeAction', SCH('LikeAction'), 'IAction'])
propData['ILikeAction'] = {}

typeData.push(['IWantAction', SCH('WantAction'), 'IAction'])
propData['IWantAction'] = {}

typeData.push(['IVoteAction', SCH('VoteAction'), 'IAction'])
propData['IVoteAction'] = {}

typeData.push(['IDrinkAction', SCH('DrinkAction'), 'IAction'])
propData['IDrinkAction'] = {}

typeData.push(['IEatAction', SCH('EatAction'), 'IAction'])
propData['IEatAction'] = {}

typeData.push(['IInstallAction', SCH('InstallAction'), 'IAction'])
propData['IInstallAction'] = {}

typeData.push(['IListenAction', SCH('ListenAction'), 'IAction'])
propData['IListenAction'] = {}

typeData.push(['IPlayGameAction', SCH('PlayGameAction'), 'IAction'])
propData['IPlayGameAction'] = {}

typeData.push(['IReadAction', SCH('ReadAction'), 'IAction'])
propData['IReadAction'] = {}

typeData.push(['IUseAction', SCH('UseAction'), 'IAction'])
propData['IUseAction'] = {}

typeData.push(['IViewAction', SCH('ViewAction'), 'IAction'])
propData['IViewAction'] = {}

typeData.push(['IWatchAction', SCH('WatchAction'), 'IAction'])
propData['IWatchAction'] = {}

typeData.push(['IControlAction', SCH('ControlAction'), 'IAction'])
propData['IControlAction'] = {}

typeData.push(['ICreateAction', SCH('CreateAction'), 'IAction'])
propData['ICreateAction'] = {}

typeData.push(['IActivateAction', SCH('ActivateAction'), 'IAction'])
propData['IActivateAction'] = {}

typeData.push(['IDeactivateAction', SCH('DeactivateAction'), 'IAction'])
propData['IDeactivateAction'] = {}

typeData.push(['IResumeAction', SCH('ResumeAction'), 'IAction'])
propData['IResumeAction'] = {}

typeData.push(['ISuspendAction', SCH('SuspendAction'), 'IAction'])
propData['ISuspendAction'] = {}

typeData.push(['IFindAction', SCH('FindAction'), 'IAction'])
propData['IFindAction'] = {}

typeData.push(['ICheckAction', SCH('CheckAction'), 'IAction'])
propData['ICheckAction'] = {}

typeData.push(['IDiscoverAction', SCH('DiscoverAction'), 'IAction'])
propData['IDiscoverAction'] = {}

typeData.push(['ITrackAction', SCH('TrackAction'), 'IAction'])
propData['ITrackAction'] = {}

typeData.push(['IInteractAction', SCH('InteractAction'), 'IAction'])
propData['IInteractAction'] = {}

typeData.push(['IBefriendAction', SCH('BefriendAction'), 'IAction'])
propData['IBefriendAction'] = {}

typeData.push(['ICommunicateAction', SCH('CommunicateAction'), 'IAction'])
propData['ICommunicateAction'] = {}

typeData.push(['IFollowAction', SCH('FollowAction'), 'IAction'])
propData['IFollowAction'] = {}

typeData.push(['IJoinAction', SCH('JoinAction'), 'IAction'])
propData['IJoinAction'] = {}

typeData.push(['ILeaveAction', SCH('LeaveAction'), 'IAction'])
propData['ILeaveAction'] = {}

typeData.push(['IMarryAction', SCH('MarryAction'), 'IAction'])
propData['IMarryAction'] = {}

typeData.push(['IRegisterAction', SCH('RegisterAction'), 'IAction'])
propData['IRegisterAction'] = {}

typeData.push(['ISubscribeAction', SCH('SubscribeAction'), 'IAction'])
propData['ISubscribeAction'] = {}

typeData.push(['IUnRegisterAction', SCH('UnRegisterAction'), 'IAction'])
propData['IUnRegisterAction'] = {}

typeData.push(['IMoveAction', SCH('MoveAction'), 'IAction'])
propData['IMoveAction'] = {}

typeData.push(['IArriveAction', SCH('ArriveAction'), 'IAction'])
propData['IArriveAction'] = {}

typeData.push(['IDepartAction', SCH('DepartAction'), 'IAction'])
propData['IDepartAction'] = {}

typeData.push(['ITravelAction', SCH('TravelAction'), 'IAction'])
propData['ITravelAction'] = {}

typeData.push(['IOrganizeAction', SCH('OrganizeAction'), 'IAction'])
propData['IOrganizeAction'] = {}

typeData.push(['IAllocateAction', SCH('AllocateAction'), 'IAction'])
propData['IAllocateAction'] = {}

typeData.push(['IApplyAction', SCH('ApplyAction'), 'IAction'])
propData['IApplyAction'] = {}

typeData.push(['IBookmarkAction', SCH('BookmarkAction'), 'IAction'])
propData['IBookmarkAction'] = {}

typeData.push(['IPlanAction', SCH('PlanAction'), 'IAction'])
propData['IPlanAction'] = {}

typeData.push(['IPlayAction', SCH('PlayAction'), 'IAction'])
propData['IPlayAction'] = {}

typeData.push(['ISearchAction', SCH('SearchAction'), 'IAction'])
propData['ISearchAction'] = {}

typeData.push(['ISeekToAction', SCH('SeekToAction'), 'IAction'])
propData['ISeekToAction'] = {}

typeData.push(['ISolveMathAction', SCH('SolveMathAction'), 'IAction'])
propData['ISolveMathAction'] = {}

typeData.push(['ITradeAction', SCH('TradeAction'), 'IAction'])
propData['ITradeAction'] = {}
addProperty(propData['ITradeAction'], ['price', 'string', SCH('price'), false, true])
addProperty(propData['ITradeAction'], ['priceCurrency', 'string', SCH('priceCurrency'), false, true])
addProperty(propData['ITradeAction'], ['priceSpecification', 'IPriceSpecification', SCH('priceSpecification'), false, true])

typeData.push(['IBuyAction', SCH('BuyAction'), 'ITradeAction'])
propData['IBuyAction'] = {}
addProperty(propData['IBuyAction'], ['seller', ['IPerson', 'IOrganization'], SCH('seller'), false, true])

typeData.push(['IDonateAction', SCH('DonateAction'), 'IAction'])
propData['IDonateAction'] = {}

typeData.push(['IOrderAction', SCH('OrderAction'), 'IAction'])
propData['IOrderAction'] = {}

typeData.push(['IPayAction', SCH('PayAction'), 'IAction'])
propData['IPayAction'] = {}

typeData.push(['IPreOrderAction', SCH('PreOrderAction'), 'IAction'])
propData['IPreOrderAction'] = {}

typeData.push(['IQuoteAction', SCH('QuoteAction'), 'IAction'])
propData['IQuoteAction'] = {}

typeData.push(['IRentAction', SCH('RentAction'), 'IAction'])
propData['IRentAction'] = {}

typeData.push(['ISellAction', SCH('SellAction'), 'IAction'])
propData['ISellAction'] = {}

typeData.push(['ITipAction', SCH('TipAction'), 'IAction'])
propData['ITipAction'] = {}

typeData.push(['ITransferAction', SCH('TransferAction'), 'IAction'])
propData['ITransferAction'] = {}

typeData.push(['IBorrowAction', SCH('BorrowAction'), 'IAction'])
propData['IBorrowAction'] = {}

typeData.push(['IDownloadAction', SCH('DownloadAction'), 'IAction'])
propData['IDownloadAction'] = {}

typeData.push(['IGiveAction', SCH('GiveAction'), 'IAction'])
propData['IGiveAction'] = {}

typeData.push(['ILendAction', SCH('LendAction'), 'IAction'])
propData['ILendAction'] = {}

typeData.push(['IMoneyTransfer', SCH('MoneyTransfer'), 'IAction'])
propData['IMoneyTransfer'] = {}

typeData.push(['IReceiveAction', SCH('ReceiveAction'), 'IAction'])
propData['IReceiveAction'] = {}

typeData.push(['IReturnAction', SCH('ReturnAction'), 'IAction'])
propData['IReturnAction'] = {}

typeData.push(['ISendAction', SCH('SendAction'), 'IAction'])
propData['ISendAction'] = {}

typeData.push(['ITakeAction', SCH('TakeAction'), 'IAction'])
propData['ITakeAction'] = {}

typeData.push(['IUpdateAction', SCH('UpdateAction'), 'IAction'])
propData['IUpdateAction'] = {}

typeData.push(['IAddAction', SCH('AddAction'), 'IAction'])
propData['IAddAction'] = {}

typeData.push(['IDeleteAction', SCH('DeleteAction'), 'IAction'])
propData['IDeleteAction'] = {}

typeData.push(['IReplaceAction', SCH('ReplaceAction'), 'IAction'])
propData['IReplaceAction'] = {}

typeData.push(['IMediaObject', SCH('MediaObject'), 'IThing'])
propData['IMediaObject'] = {}
addProperty(propData['IMediaObject'], ['associatedArticle', 'IThing', SCH('associatedArticle'), false, true])
addProperty(propData['IMediaObject'], ['bitrate', 'string', SCH('bitrate'), false, true])
addProperty(propData['IMediaObject'], ['contentSize', 'string', SCH('contentSize'), false, true])
addProperty(propData['IMediaObject'], ['contentUrl', 'string', SCH('contentSUrl'), false, true])
addProperty(propData['IMediaObject'], ['duration', 'string', SCH('duration'), false, true])
addProperty(propData['IMediaObject'], ['embedUrl', 'string', SCH('embedUrl'), false, true])
addProperty(propData['IMediaObject'], ['encodesCreativeWork', 'IThing', SCH('encodesCreativeWork'), false, true])
addProperty(propData['IMediaObject'], ['startTime', 'Date', SCH('startTime'), false, true])
addProperty(propData['IMediaObject'], ['endTime', 'Date', SCH('endTime'), false, true])
addProperty(propData['IMediaObject'], ['height', 'number', SCH('height'), false, true])
addProperty(propData['IMediaObject'], ['width', 'number', SCH('width'), false, true])
addProperty(propData['IMediaObject'], ['playerType', 'string', SCH('playerType'), false, true])
addProperty(propData['IMediaObject'], ['productionCompany', 'IOrganization', SCH('productionCompany'), true, true])
addProperty(propData['IMediaObject'], ['requiresSubscription', 'boolean', SCH('requiresSubscription'), true, true])
addProperty(propData['IMediaObject'], ['uploadDate', 'Date', SCH('uploadDate'), false, true])

typeData.push(['IBrand', ATX('Brand'), 'IThing'])
propData['IBrand'] = {}
addProperty(propData['IBrand'], ['slug', 'string', ATX('Brand.slug'), false, true])

typeData.push(['IDefinedTermSet', SCH('DefinedTermSet'), 'IThing'])
propData['IDefinedTermSet'] = {}
addProperty(propData['IDefinedTermSet'], ['hasDefinedTerm', 'IDefinedTerm', SCH('hasDefinedTerm'), true, true])

typeData.push(['IDefinedTerm', SCH('DefinedTerm'), 'IThing'])
propData['IDefinedTerm'] = {}
addProperty(propData['IDefinedTerm'], ['inDefinedTermSet', 'IDefinedTermSet', SCH('inDefinedTermSet'), false, true])
addProperty(propData['IDefinedTerm'], ['termCode', 'string', SCH('termCode'), false, true])

typeData.push(['ICategoryCodeSet', SCH('CategoryCodeSet'), 'IDefinedTermSet'])
propData['ICategoryCodeSet'] = {}
addProperty(propData['ICategoryCodeSet'], ['hasCategoryCode', 'ICategoryCode', SCH('hasCategoryCode'), true, true])

typeData.push(['ICategoryCode', SCH('CategoryCode'), 'IDefinedTerm'])
propData['ICategoryCode'] = {}
addProperty(propData['ICategoryCode'], ['codeValue', 'string', SCH('codeValue'), false, true])
addProperty(propData['ICategoryCode'], ['inCodeSet', 'ICategoryCodeSet', SCH('inCodeSet'), false, true])

typeData.push(['IPropertyValue', SCH('PropertyValue'), 'IThing'])
propData['IPropertyValue'] = {}
addProperty(propData['IPropertyValue'], ['maxValue', 'number', SCH('maxValue'), false, true])
addProperty(propData['IPropertyValue'], ['minValue', 'number', SCH('minValue'), false, true])
addProperty(propData['IPropertyValue'], ['propertyID', 'IDefinedTermSet', SCH('propertyID'), false, true])
addProperty(propData['IPropertyValue'], ['unitCode', 'string', SCH('unitCode'), false, true])
addProperty(propData['IPropertyValue'], ['unitText', 'string', SCH('unitText'), false, true])
addProperty(propData['IPropertyValue'], ['value', 'IDefinedTerm', SCH('value'), false, true])
addProperty(propData['IPropertyValue'], ['valueReference', 'IThing', SCH('valueReference'), false, true])

typeData.push(['IService', SCH('Service'), 'IThing'])
propData['IService'] = {}
addProperty(propData['IService'], ['aggregateRating', 'IThing', SCH('aggregateRating'), false, true])
addProperty(propData['IService'], ['areaServed', 'IPlace', SCH('areaServed'), false, true])
addProperty(propData['IService'], ['audience', 'IThing', SCH('audience'), false, true])
addProperty(propData['IService'], ['availableChannel', 'IThing', SCH('availableChannel'), false, true])
addProperty(propData['IService'], ['award', 'string', SCH('award'), false, true])
addProperty(propData['IService'], ['brand', 'IBrand', SCH('brand'), false, true])
addProperty(propData['IService'], ['category', 'IThing', SCH('category'), false, true])
addProperty(propData['IService'], ['hasOfferCatalog', 'IOfferCatalog', SCH('hasOfferCatalog'), false, true])
addProperty(propData['IService'], ['hoursAvailable', 'IThing', SCH('hoursAvailable'), false, true])
addProperty(propData['IService'], ['isRelatedTo', ['IProduct', 'IService'], SCH('isRelatedTo'), false, true])
addProperty(propData['IService'], ['isSimilarTo', ['IProduct', 'IService'], SCH('isSimilarTo'), false, true])
addProperty(propData['IService'], ['logo', 'IMediaObject', SCH('logo'), false, true])
addProperty(propData['IService'], ['offers', 'IOffer', SCH('offers'), true, true])
addProperty(propData['IService'], ['provider', ['IOrganization', 'IPerson'], SCH('provider'), false, true])
addProperty(propData['IService'], ['providerMobility', 'string', SCH('providerMobility'), false, true])
addProperty(propData['IService'], ['review', 'IThing', SCH('review'), true, true])
addProperty(propData['IService'], ['serviceOutput', 'IThing', SCH('serviceOutput'), true, true])
addProperty(propData['IService'], ['serviceType', 'IThing', SCH('serviceType'), false, true])
addProperty(propData['IService'], ['slogan', 'string', SCH('slogan'), false, true])
addProperty(propData['IService'], ['termsOfService', 'IThing', SCH('slogan'), false, true])

typeData.push(['IServiceChannel', SCH('ServiceChannel'), 'IThing'])
propData['IServiceChannel'] = {}
addProperty(propData['IServiceChannel'], ['availableLanguage', 'IThing', SCH('availableLanguage'), false, true])
addProperty(propData['IServiceChannel'], ['processingTime', 'string', SCH('processingTime'), false, true])
addProperty(propData['IServiceChannel'], ['providesService', 'IService', SCH('providesService'), false, true])
addProperty(propData['IServiceChannel'], ['serviceLocation', 'IPlace', SCH('serviceLocation'), false, true])
addProperty(propData['IServiceChannel'], ['servicePhone', 'IContactPoint', SCH('servicePhone'), false, true])
addProperty(propData['IServiceChannel'], ['servicePostalAddress', 'IPostalAddress', SCH('servicePostalAddress'), false, true])
addProperty(propData['IServiceChannel'], ['serviceSmsNumber', 'IContactPoint', SCH('serviceSmsNumber'), false, true])
addProperty(propData['IServiceChannel'], ['serviceUrl', 'IThing', SCH('serviceUrl'), false, true])

typeData.push(['IProduct', SCH('Product'), 'IThing'])
propData['IProduct'] = {}
addProperty(propData['IProduct'], ['sku', 'string', SCH('sku'), false, true])
addProperty(propData['IProduct'], ['slug', 'string', ATX('Product.slug'), false, true])
addProperty(propData['IProduct'], ['brand', 'IBrand', SCH('brand'), false, true])
addProperty(propData['IProduct'], ['model', 'IThing', SCH('model'), false, true])
addProperty(propData['IProduct'], ['material', 'IThing', SCH('material'), false, true])
addProperty(propData['IProduct'], ['logo', 'IMediaObject', SCH('logo'), false, true])
addProperty(propData['IProduct'], ['size', 'string', SCH('size'), false, true])
addProperty(propData['IProduct'], ['color', 'string', SCH('color'), false, true])
addProperty(propData['IProduct'], ['height', 'string', SCH('height'), false, true])
addProperty(propData['IProduct'], ['width', 'string', SCH('width'), false, true])
addProperty(propData['IProduct'], ['depth', 'string', SCH('depth'), false, true])
addProperty(propData['IProduct'], ['weight', 'string', SCH('weight'), false, true])
addProperty(propData['IProduct'], ['productID', 'string', SCH('productID'), false, true])
addProperty(propData['IProduct'], ['releaseDate', 'Date', SCH('releaseDate'), false, true])
addProperty(propData['IProduct'], ['countryOfOrigin', 'IThing', SCH('countryOfOrigin'), false, true])
addProperty(propData['IProduct'], ['offers', 'IOffer', SCH('offers'), true, true])
addProperty(propData['IProduct'], ['keywords', 'string', SCH('keywords'), true, true])
addProperty(propData['IProduct'], ['additionalProperty', 'IPropertyValue', SCH('additionalProperty'), true, true])

typeData.push(['IProductGroup', SCH('ProductGroup'), 'IProduct'])
propData['IProductGroup'] = {}
addProperty(propData['IProductGroup'], ['hasVariant', 'IProduct', SCH('hasVariant'), true, true])
addProperty(propData['IProductGroup'], ['productGroupID', 'string', SCH('productGroupID'), false, true])
addProperty(propData['IProductGroup'], ['variesBy', 'string', SCH('variesBy'), false, true])

typeData.push(['IOffer', SCH('Offer'), 'IThing'])
propData['IOffer'] = {}
addProperty(propData['IOffer'], ['acceptedPaymentMethod', 'IPaymentMethod', SCH('acceptedPaymentMethod'), true, true])
addProperty(propData['IOffer'], ['addOn', 'IOffer', SCH('addOn'), true, true])
addProperty(propData['IOffer'], ['advanceBookingRequirement', 'string', SCH('advanceBookingRequirement'), false, true])
addProperty(propData['IOffer'], ['areaServed', 'IPlace', SCH('areaServed'), false, true])
addProperty(propData['IOffer'], ['availability', 'string', SCH('availability'), false, true])
addProperty(propData['IOffer'], ['availabilityStarts', 'Date', SCH('availabilityStarts'), false, true])
addProperty(propData['IOffer'], ['availabilityEnds', 'Date', SCH('availabilityEnds'), false, true])
addProperty(propData['IOffer'], ['availableAtOrFrom', 'Date', SCH('availableAtOrFrom'), false, true])
addProperty(propData['IOffer'], ['availableDeliveryMethod', 'IDeliveryMethod', SCH('availableDeliveryMethod'), true, true])
addProperty(propData['IOffer'], ['businessFunction', 'IThing', SCH('businessFunction'), false, true])
addProperty(propData['IOffer'], ['category', 'IThing', SCH('category'), false, true])
addProperty(propData['IOffer'], ['deliveryLeadTime', 'string', SCH('deliveryLeadTime'), false, true])
addProperty(propData['IOffer'], ['eligibleCustomerType', 'IThing', SCH('eligibleCustomerType'), false, true])
addProperty(propData['IOffer'], ['eligibleDuration', 'string', SCH('eligibleDuration'), false, true])
addProperty(propData['IOffer'], ['eligibleQuantity', 'number', SCH('eligibleQuantity'), false, true])
addProperty(propData['IOffer'], ['eligibleRegion', 'IPlace', SCH('eligibleRegion'), true, true])
addProperty(propData['IOffer'], ['eligibleTransactionVolume', 'number', SCH('eligibleTransactionVolume'), false, true])
addProperty(propData['IOffer'], ['hasAdultConsideration', 'boolean', SCH('hasAdultConsideration'), false, true])
addProperty(propData['IOffer'], ['inventoryLevel', 'number', SCH('inventoryLevel'), false, true])
addProperty(propData['IOffer'], ['isFamilyFriendly', 'boolean', SCH('isFamilyFriendly'), false, true])
addProperty(propData['IOffer'], ['itemCondition', 'IThing', SCH('itemCondition'), false, true])
addProperty(propData['IOffer'], ['itemOffered', 'IProduct', SCH('itemOffered'), false, true])
addProperty(propData['IOffer'], ['leaseLength', 'string', SCH('leaseLength'), false, true])
addProperty(propData['IOffer'], ['offeredBy', ['IPerson', 'IOrganization'], SCH('offeredBy'), false, true])
addProperty(propData['IOffer'], ['price', 'number', SCH('price'), false, true])
addProperty(propData['IOffer'], ['priceCurrency', 'string', SCH('priceCurrency'), false, true])
addProperty(propData['IOffer'], ['priceSpecification', 'IPriceSpecification', SCH('priceSpecification'), false, true])
addProperty(propData['IOffer'], ['seller', ['IPerson', 'IOrganization'], SCH('seller'), false, true])
addProperty(propData['IOffer'], ['serialNumber', 'string', SCH('serialNumber'), false, true])
addProperty(propData['IOffer'], ['sku', 'string', SCH('sku'), false, true])
addProperty(propData['IOffer'], ['validFrom', 'Date', SCH('validFrom'), false, true])
addProperty(propData['IOffer'], ['validThrough', 'Date', SCH('validThrough'), false, true])
addProperty(propData['IOffer'], ['warranty', 'IThing', SCH('warrany'), false, true])

typeData.push(['IPriceSpecification', SCH('PriceSpecification'), 'IThing'])
propData['IPriceSpecification'] = {}
addProperty(propData['IPriceSpecification'], ['price', 'number', SCH('price'), false, true])
addProperty(propData['IPriceSpecification'], ['priceCurrency', 'string', SCH('priceCurrency'), false, true])
addProperty(propData['IPriceSpecification'], ['maxPrice', 'number', SCH('maxPrice'), false, true])
addProperty(propData['IPriceSpecification'], ['minPrice', 'number', SCH('minPrice'), false, true])
addProperty(propData['IPriceSpecification'], ['eligibleQuantity', 'number', SCH('eligibleQuantity'), false, true])
addProperty(propData['IPriceSpecification'], ['eligibleTransactionVolume', 'number', SCH('eligibleTransactionVolume'), false, true])
addProperty(propData['IPriceSpecification'], ['validFrom', 'Date', SCH('validFrom'), false, true])
addProperty(propData['IPriceSpecification'], ['validThrough', 'Date', SCH('validThrough'), false, true])
addProperty(propData['IPriceSpecification'], ['valueAddedTaxIncluded', 'boolean', SCH('valueAddedTaxIncluded'), false, true])

typeData.push(['IOfferCatalog', SCH('OfferCatalog'), 'IThing'])
propData['IOfferCatalog'] = {}
addProperty(propData['IOfferCatalog'], ['numberOfItems', 'number', SCH('numberOfItems'), false, true])
addProperty(propData['IOfferCatalog'], ['itemList', 'IOffer', SCH('itemList'), true, true])

typeData.push(['IOrder', SCH('Order'), 'IThing'])
propData['IOrder'] = {}
addProperty(propData['IOrder'], ['acceptedOffer', 'IOffer', SCH('acceptedOffer'), true, true])
addProperty(propData['IOrder'], ['billingAddress', 'IPostalAddress', SCH('billingAddress'), false, true])
addProperty(propData['IOrder'], ['broker', ['IPerson', 'IOrganization'], SCH('broker'), false, true])
addProperty(propData['IOrder'], ['confirmationNumber', 'string', SCH('confirmationNumber'), false, true])
addProperty(propData['IOrder'], ['customer', ['IPerson', 'IOrganization'], SCH('customer'), false, true])
addProperty(propData['IOrder'], ['discount', 'number', SCH('discount'), false, true])
addProperty(propData['IOrder'], ['discountCode', 'string', SCH('discountCode'), false, true])
addProperty(propData['IOrder'], ['discountCurrency', 'string', SCH('discountCurrency'), false, true])
addProperty(propData['IOrder'], ['isGift', 'boolean', SCH('isGift'), false, true])
addProperty(propData['IOrder'], ['orderDate', 'Date', SCH('orderDate'), false, true])
addProperty(propData['IOrder'], ['orderDelivery', 'IParcelDelivery', SCH('orderDelivery'), true, true])
addProperty(propData['IOrder'], ['orderNumber', 'string', SCH('orderNumber'), true, true])
addProperty(propData['IOrder'], ['orderStatus', 'IOrderStatus', SCH('orderStatus'), true, true])
addProperty(propData['IOrder'], ['orderedItem', 'IOrderItem', SCH('orderDelivery'), true, true])
addProperty(propData['IOrder'], ['partOfInvoice', 'IInvoice', SCH('partOfInvoice'), false, true])
addProperty(propData['IOrder'], ['paymentDueDate', 'Date', SCH('paymentDueDate'), false, true])
addProperty(propData['IOrder'], ['paymentMethod', 'IPaymentMethod', SCH('paymentMethod'), true, true])
addProperty(propData['IOrder'], ['paymentMethodId', 'string', SCH('paymentMethodId'), true, true])
addProperty(propData['IOrder'], ['paymentUrl', 'IThing', SCH('paymentUrl'), true, true])
addProperty(propData['IOrder'], ['seller', 'IThing', SCH('seller'), false, true])

typeData.push(['IPaymentMethod', SCH('PaymentMethod'), 'IThing'])
propData['IPaymentMethod'] = {}

typeData.push(['IParcelDelivery', SCH('ParcelDelivery'), 'IThing'])
propData['IParcelDelivery'] = {}
addProperty(propData['IParcelDelivery'], ['deliveryAddress', 'IPostalAddress', SCH('deliveryAddress'), false, true])

typeData.push(['IOrderItem', SCH('OrderItem'), 'IThing'])
propData['IOrderItem'] = {}
addProperty(propData['IOrderItem'], ['orderDelivery', 'IParcelDelivery', SCH('orderDelivery'), false, true])
addProperty(propData['IOrderItem'], ['orderItemNumber', 'string', SCH('orderItemNumber'), false, true])
addProperty(propData['IOrderItem'], ['orderItemStatus', 'IOrderStatus', SCH('orderItemStatus'), false, true])
addProperty(propData['IOrderItem'], ['orderQuantity', 'number', SCH('orderQuantity'), false, true])
addProperty(propData['IOrderItem'], ['orderedItem', ['IProduct', 'IService'], SCH('orderQuantity'), false, true])

typeData.push(['IOrderStatus', SCH('OrderStatus'), 'IThing'])
propData['IOrderStatus'] = {}

typeData.push(['IInvoice', SCH('Invoice'), 'IThing'])
propData['IInvoice'] = {}
addProperty(propData['IInvoice'], ['accountId', 'string', SCH('accountId'), false, true])
addProperty(propData['IInvoice'], ['billingPeriod', 'string', SCH('billingPeriod'), false, true])
addProperty(propData['IInvoice'], ['broker', ['IPerson', 'IOrganization'], SCH('broker'), false, true])
addProperty(propData['IInvoice'], ['category', 'IThing', SCH('category'), false, true])
addProperty(propData['IInvoice'], ['confirmationNumber', 'string', SCH('confirmationNumber'), false, true])
addProperty(propData['IInvoice'], ['customer', ['IPerson', 'IOrganization'], SCH('customer'), false, true])
addProperty(propData['IInvoice'], ['minimumPaymentDue', 'IPriceSpecification', SCH('minimumPaymentDue'), false, true])
addProperty(propData['IInvoice'], ['paymentDueDate', 'Date', SCH('paymentDueDate'), false, true])
addProperty(propData['IInvoice'], ['paymentMethod', 'IPaymentMethod', SCH('paymentMethod'), true, true])
addProperty(propData['IInvoice'], ['paymentMethodId', 'string', SCH('paymentMethod'), true, true])
addProperty(propData['IInvoice'], ['paymentStatus', 'string', SCH('paymentStatus'), true, true])
addProperty(propData['IInvoice'], ['provider', ['IPerson', 'IOrganization'], SCH('provider'), false, true])
addProperty(propData['IInvoice'], ['referencesOrder', 'IOrder', SCH('referencesOrder'), false, true])
addProperty(propData['IInvoice'], ['scheduledPaymentDate', 'Date', SCH('scheduledPaymentDate'), false, true])
addProperty(propData['IInvoice'], ['totalPaymentDue', 'IPriceSpecification', SCH('totalPaymentDue'), false, true])

typeData.push(['IEvent', SCH('Event'), 'IThing'])
propData['IEvent'] = {}
addProperty(propData['IEvent'], ['about', 'IThing', SCH('about'), false, true])
addProperty(propData['IEvent'], ['actor', 'IPerson', SCH('actor'), true, true])
addProperty(propData['IEvent'], ['attendee', 'IPerson', SCH('attendee'), true, true])
addProperty(propData['IEvent'], ['audience', 'IThing', SCH('audience'), true, true])
addProperty(propData['IEvent'], ['contributor', ['IPerson', 'IOrganization'], SCH('contributor'), true, true])
addProperty(propData['IEvent'], ['director', 'IPerson', SCH('director'), true, true])
addProperty(propData['IEvent'], ['duration', 'string', SCH('duration'), false, true])
addProperty(propData['IEvent'], ['funder', ['IPerson', 'IOrganization'], SCH('funder'), true, true])
addProperty(propData['IEvent'], ['startDate', 'Date', SCH('startDate'), false, true])
addProperty(propData['IEvent'], ['endDate', 'Date', SCH('endDate'), false, true])
addProperty(propData['IEvent'], ['eventAttendanceMode', 'IThing', SCH('eventAttendanceMode'), false, true])
addProperty(propData['IEvent'], ['eventSchedule', 'IThing', SCH('eventSchedule'), false, true])
addProperty(propData['IEvent'], ['eventStatus', 'IThing', SCH('eventStatus'), false, true])
addProperty(propData['IEvent'], ['inLanguage', 'IThing', SCH('inLanguage'), true, true])
addProperty(propData['IEvent'], ['isAccessibleForFree', 'boolean', SCH('isAccessibleForFree'), false, true])
addProperty(propData['IEvent'], ['keywords', 'string', SCH('keywords'), true, true])
addProperty(propData['IEvent'], ['location', 'IPlace', SCH('location'), true, true])
addProperty(propData['IEvent'], ['maximumAttendeeCapacity', 'number', SCH('maximumAttendeeCapacity'), false, true])
addProperty(propData['IEvent'], ['maximumPhysicalAttendeeCapacity', 'number', SCH('maximumPhysicalAttendeeCapacity'), false, true])
addProperty(propData['IEvent'], ['maximumVirtualAttendeeCapacity', 'number', SCH('maximumVirtualAttendeeCapacity'), false, true])
addProperty(propData['IEvent'], ['remainingmAttendeeCapacity', 'number', SCH('remainingAttendeeCapacity'), false, true])
addProperty(propData['IEvent'], ['offers', 'IOffer', SCH('offer'), true, true])
addProperty(propData['IEvent'], ['organizer', ['IPerson', 'IOrganization'], SCH('organizer'), true, true])
addProperty(propData['IEvent'], ['sponsor', ['IPerson', 'IOrganization'], SCH('sponsor'), true, true])
addProperty(propData['IEvent'], ['performer', ['IPerson', 'IOrganization'], SCH('performer'), true, true])
addProperty(propData['IEvent'], ['translator', ['IPerson', 'IOrganization'], SCH('translator'), true, true])
addProperty(propData['IEvent'], ['subEvent', 'IEvent', SCH('subEvent'), true, true])
addProperty(propData['IEvent'], ['superEvent', 'IEvent', SCH('superEvent'), true, true])
addProperty(propData['IEvent'], ['recordedIn', 'IThing', SCH('recordedIn'), true, true])
addProperty(propData['IEvent'], ['workFeatured', 'IThing', SCH('workFeatured'), true, true])
addProperty(propData['IEvent'], ['workPerformed', 'IThing', SCH('workPerformed'), true, true])

typeData.push(['IDeliveryEvent', SCH('DeliveryEvent'), 'IEvent'])
propData['IDeliveryEvent'] = {}
addProperty(propData['IDeliveryEvent'], ['accessCode', 'string', SCH('accessCode'), false, true])
addProperty(propData['IDeliveryEvent'], ['availableFrom', 'Date', SCH('availableFrom'), false, true])
addProperty(propData['IDeliveryEvent'], ['availableThrough', 'Date', SCH('availableThrough'), false, true])
addProperty(propData['IDeliveryEvent'], ['hasDeliveryMethod', 'IDeliveryMethod', SCH('hasDeliveryMethod'), false, true])

typeData.push(['IDeliveryMethod', SCH('DeliveryMethod'), 'IThing'])
propData['IDeliveryMethod'] = {}

typeData.push(['IContactPoint', SCH('ContactPoint'), 'IThing'])
propData['IContactPoint'] = {}
addProperty(propData['IContactPoint'], ['areaServed', 'IPlace', SCH('areaServed'), true, true])
addProperty(propData['IContactPoint'], ['contactType', 'string', SCH('contactType'), false, true])
addProperty(propData['IContactPoint'], ['email', 'string', SCH('email'), false, true])
addProperty(propData['IContactPoint'], ['faxNumber', 'string', SCH('faxNumber'), false, true])
addProperty(propData['IContactPoint'], ['hoursAvailable', 'IThing', SCH('hoursAvailable'), false, true])
addProperty(propData['IContactPoint'], ['productsSupported', 'IProduct', SCH('productsSupported'), true, true])
addProperty(propData['IContactPoint'], ['telephone', 'string', SCH('faxNumber'), false, true])

typeData.push(['IPostalAddress', SCH('PostalAddress'), 'IContactPoint'])
propData['IPostalAddress'] = {}
addProperty(propData['IPostalAddress'], ['addressCountry', 'string', SCH('addressCountry'), false, true])
addProperty(propData['IPostalAddress'], ['addressLocality', 'string', SCH('addressLocality'), false, true])
addProperty(propData['IPostalAddress'], ['addressRegion', 'string', SCH('addressRegion'), false, true])
addProperty(propData['IPostalAddress'], ['postOfficeBoxNumber', 'string', SCH('postOfficeBoxNumber'), false, true])
addProperty(propData['IPostalAddress'], ['postalCode', 'string', SCH('postalCode'), false, true])
addProperty(propData['IPostalAddress'], ['streetAddress', 'string', SCH('streetAddress'), false, true])

typeData.push(['IGeoCoordinates', SCH('GeoCoordinates'), 'IThing'])
propData['IGeoCoordinates'] = {}
addProperty(propData['IGeoCoordinates'], ['address', 'IPostalAddress', SCH('address'), false, true])
addProperty(propData['IGeoCoordinates'], ['elevation', 'string', SCH('elevation'), false, true])
addProperty(propData['IGeoCoordinates'], ['latitude', 'string', SCH('latitude'), false, true])
addProperty(propData['IGeoCoordinates'], ['longitude', 'string', SCH('longitude'), false, true])

typeData.push(['IPlace', SCH('Place'), 'IThing'])
propData['IPlace'] = {}
addProperty(propData['IPlace'], ['additionalProperty', 'IThing', SCH('additionalProperty'), true, true])
addProperty(propData['IPlace'], ['address', 'IPostalAddress', SCH('address'), false, true])
addProperty(propData['IPlace'], ['branchCode', 'string', SCH('branchCode'), false, true])
addProperty(propData['IPlace'], ['containedInPlace', 'IPlace', SCH('containedInPlace'), false, true])
addProperty(propData['IPlace'], ['containsPlace', 'IPlace', SCH('containsPlace'), true, true])
addProperty(propData['IPlace'], ['event', 'IEvent', SCH('event'), true, true])
addProperty(propData['IPlace'], ['faxNumber', 'string', SCH('faxNumber'), false, true])
addProperty(propData['IPlace'], ['telephone', 'string', SCH('telephone'), false, true])
addProperty(propData['IPlace'], ['geo', 'IGeoCoordinates', SCH('geo'), false, true])
addProperty(propData['IPlace'], ['geoContains', 'IPlace', SCH('geoContains'), true, true])
addProperty(propData['IPlace'], ['geoCoveredBy', 'IPlace', SCH('geoCoveredBy'), true, true])
addProperty(propData['IPlace'], ['geoCovers', 'IPlace', SCH('geoCovers'), true, true])
addProperty(propData['IPlace'], ['geoCrosses', 'IPlace', SCH('geoCrosses'), true, true])
addProperty(propData['IPlace'], ['geoDisjoint', 'IPlace', SCH('geoDisjoint'), true, true])
addProperty(propData['IPlace'], ['geoEquals', 'IPlace', SCH('geoEquals'), true, true])
addProperty(propData['IPlace'], ['geoIntersects', 'IPlace', SCH('geoIntersects'), true, true])
addProperty(propData['IPlace'], ['geoOverlaps', 'IPlace', SCH('geoOverlaps'), true, true])
addProperty(propData['IPlace'], ['geoTouces', 'IPlace', SCH('geoTouces'), true, true])
addProperty(propData['IPlace'], ['geoWithin', 'IPlace', SCH('geoWithin'), true, true])
addProperty(propData['IPlace'], ['globalLocationNumber', 'string', SCH('globalLocationNumber'), false, true])
addProperty(propData['IPlace'], ['hasDriveThroughService', 'boolean', SCH('hasDriveThroughService'), false, true])
addProperty(propData['IPlace'], ['hasMap', 'IThing', SCH('hasMap'), false, true])
addProperty(propData['IPlace'], ['isAccessibleForFree', 'boolean', SCH('isAccessibleForFree'), false, true])
addProperty(propData['IPlace'], ['keywords', 'string', SCH('keywords'), true, true])
addProperty(propData['IPlace'], ['latitude', 'string', SCH('latitude'), false, true])
addProperty(propData['IPlace'], ['longitude', 'string', SCH('longitude'), false, true])
addProperty(propData['IPlace'], ['logo', 'IMediaObject', SCH('logo'), false, true])
addProperty(propData['IPlace'], ['photo', 'IMediaObject', SCH('photo'), false, true])
addProperty(propData['IPlace'], ['publicAccess', 'boolean', SCH('publicAccess'), false, true])
addProperty(propData['IPlace'], ['slogan', 'string', SCH('slogal'), false, true])
addProperty(propData['IPlace'], ['smokingAllowed', 'boolean', SCH('smokingAllowed'), false, true])
addProperty(propData['IPlace'], ['tourBookingPage', 'IThing', SCH('tourBookingPage'), false, true])

typeData.push(['IAccommodation', SCH('Accommodation'), 'IPlace'])
propData['IAccommodation'] = {}
addProperty(propData['IAccommodation'], ['accommodationFloorPlan', 'IThing', SCH('accommodationFloorPlan'), false, true])
addProperty(propData['IAccommodation'], ['tourBookingPage', 'IThing', SCH('tourBookingPage'), false, true])
addProperty(propData['IAccommodation'], ['numberOfBedrooms', 'number', SCH('numberOfBedrooms'), false, true])

typeData.push(['IApartmentComplex', SCH('ApartmentComplex'), 'IAccommodation'])
propData['IApartmentComplex'] = {}
addProperty(propData['IApartmentComplex'], ['numberOfAccommodationUnits', 'number', SCH('numberOfAccommodationUnits'), false, true])
addProperty(propData['IApartmentComplex'], ['numberOfAvailableAccommodationUnits', 'number', SCH('numberOfAvailableAccommodationUnits'), false, true])
addProperty(propData['IApartmentComplex'], ['petsAllowed', 'boolean', SCH('petsAllowed'), false, true])

typeData.push(['IGatedResidenceCommunity', SCH('GatedResidenceCommunity'), 'IAccommodation'])
propData['IGatedResidenceCommunity'] = {}

typeData.push(['IAdministrativeArea', SCH('AdministrativeArea'), 'IPlace'])
propData['IAdministrativeArea'] = {}

typeData.push(['ICivicStructure', SCH('CivicStructure'), 'IPlace'])
propData['ICivicStructure'] = {}

typeData.push(['IAirport', SCH('Airport'), 'ICivicStructure'])
propData['IAirport'] = {}

typeData.push(['IAquarium', SCH('Aquarium'), 'ICivicStructure'])
propData['IAquarium'] = {}

typeData.push(['IBeach', SCH('Beach'), 'ICivicStructure'])
propData['IBeach'] = {}

typeData.push(['IBoatTerminal', SCH('BoatTerminal'), 'ICivicStructure'])
propData['IBoatTerminal'] = {}

typeData.push(['IBridge', SCH('Bridge'), 'ICivicStructure'])
propData['IBridge'] = {}

typeData.push(['IBusStation', SCH('BusStation'), 'ICivicStructure'])
propData['IBusStation'] = {}

typeData.push(['IBusStop', SCH('BusStop'), 'ICivicStructure'])
propData['IBusStop'] = {}

typeData.push(['ICampground', SCH('Campground'), 'ICivicStructure'])
propData['ICampground'] = {}

typeData.push(['ICemetery', SCH('Cemetery'), 'ICivicStructure'])
propData['ICemetery'] = {}

typeData.push(['ICrematorium', SCH('Crematorium'), 'ICivicStructure'])
propData['ICrematorium'] = {}

typeData.push(['IEventVenue', SCH('EventVenue'), 'ICivicStructure'])
propData['IEventVenue'] = {}

typeData.push(['IFireStation', SCH('FireStation'), 'ICivicStructure'])
propData['IFireStation'] = {}

typeData.push(['IGovernmentBuilding', SCH('GovernmentBuilding'), 'ICivicStructure'])
propData['IGovernmentBuilding'] = {}

typeData.push(['IHospital', SCH('Hospital'), 'ICivicStructure'])
propData['IHospital'] = {}

typeData.push(['IMovieTheater', SCH('MovieTheater'), 'ICivicStructure'])
propData['IMovieTheater'] = {}

typeData.push(['IMuseum', SCH('Museum'), 'ICivicStructure'])
propData['IMuseum'] = {}

typeData.push(['IMusicVenue', SCH('MusicVenue'), 'ICivicStructure'])
propData['IMusicVenue'] = {}

typeData.push(['IPark', SCH('Park'), 'ICivicStructure'])
propData['IPark'] = {}

typeData.push(['IParkingFacility', SCH('ParkingFacility'), 'ICivicStructure'])
propData['IParkingFacility'] = {}

typeData.push(['IPerformingArtsTheater', SCH('PerformingArtsTheater'), 'ICivicStructure'])
propData['IPerformingArtsTheater'] = {}

typeData.push(['IPlaceOfWorship', SCH('PlaceOfWorship'), 'ICivicStructure'])
propData['IPlaceOfWorship'] = {}

typeData.push(['IPlayground', SCH('Playground'), 'ICivicStructure'])
propData['IPlayground'] = {}

typeData.push(['IPoliceStation', SCH('PoliceStation'), 'ICivicStructure'])
propData['IPoliceStation'] = {}

typeData.push(['IPublicToilet', SCH('PublicToilet'), 'ICivicStructure'])
propData['IPublicToilet'] = {}

typeData.push(['IRVPark', SCH('RVPark'), 'ICivicStructure'])
propData['IRVPark'] = {}

typeData.push(['IStadiumOrArena', SCH('StadiumOrArena'), 'ICivicStructure'])
propData['IStadiumOrArena'] = {}

typeData.push(['ISubwayStation', SCH('SubwayStation'), 'ICivicStructure'])
propData['ISubwayStation'] = {}

typeData.push(['ITaxiStand', SCH('TaxiStand'), 'ICivicStructure'])
propData['ITaxiStand'] = {}

typeData.push(['ITrainStation', SCH('TrainStation'), 'ICivicStructure'])
propData['ITrainStation'] = {}

typeData.push(['IZoo', SCH('Zoo'), 'ICivicStructure'])
propData['IZoo'] = {}

typeData.push(['ICityHall', SCH('CityHall'), 'IGovernmentBuilding'])
propData['ICityHall'] = {}

typeData.push(['ICourthouse', SCH('Courthouse'), 'IGovernmentBuilding'])
propData['ICourthouse'] = {}

typeData.push(['IDefenceEstablishment', SCH('DefenceEstablishment'), 'IGovernmentBuilding'])
propData['IDefenceEstablishment'] = {}

typeData.push(['IEmbassy', SCH('Embassy'), 'IGovernmentBuilding'])
propData['IEmbassy'] = {}

typeData.push(['ILegislativeBuilding', SCH('LegislativeBuilding'), 'IGovernmentBuilding'])
propData['ILegislativeBuilding'] = {}

typeData.push(['IBuddhistTemple', SCH('BuddhistTemple'), 'IPlaceOfWorship'])
propData['IBuddhistTemple'] = {}

typeData.push(['IChurch', SCH('Church'), 'IPlaceOfWorship'])
propData['IChurch'] = {}

typeData.push(['IHinduTemple', SCH('HinduTemple'), 'IPlaceOfWorship'])
propData['IHinduTemple'] = {}

typeData.push(['IMosque', SCH('Mosque'), 'IPlaceOfWorship'])
propData['IMosque'] = {}

typeData.push(['ISynagogue', SCH('Synagogue'), 'IPlaceOfWorship'])
propData['ISynagogue'] = {}

typeData.push(['ILandform', SCH('Landform'), 'IPlace'])
propData['ILandform'] = {}

typeData.push(['IBodyOfWater', SCH('BodyOfWater'), 'ILandform'])
propData['IBodyOfWater'] = {}

typeData.push(['IContinent', SCH('Continent'), 'ILandform'])
propData['IContinent'] = {}

typeData.push(['IMountain', SCH('Mountain'), 'ILandform'])
propData['IMountain'] = {}

typeData.push(['IVolcano', SCH('Volcano'), 'ILandform'])
propData['IVolcano'] = {}

typeData.push(['ILandmarksOrHistoricalBuildings', SCH('LandmarksOrHistoricalBuildings'), 'IPlace'])
propData['ILandmarksOrHistoricalBuildings'] = {}

typeData.push(['IResidence', SCH('Residence'), 'IPlace'])
propData['IResidence'] = {}

typeData.push(['ITouristAttraction', SCH('TouristAttraction'), 'IPlace'])
propData['ITouristAttraction'] = {}

typeData.push(['ITouristDestination', SCH('TouristDestination'), 'IPlace'])
propData['ITouristDestination'] = {}

typeData.push(['IMonetaryAmount', SCH('MonetaryAmount'), 'IThing'])
propData['IMonetaryAmount'] = {}
addProperty(propData['IMonetaryAmount'], ['currency', 'string', SCH('currency'), false, true])
addProperty(propData['IMonetaryAmount'], ['duration', 'string', SCH('duration'), false, true])
addProperty(propData['IMonetaryAmount'], ['minValue', 'number', SCH('minValue'), false, true])
addProperty(propData['IMonetaryAmount'], ['maxValue', 'number', SCH('maxValue'), false, true])
addProperty(propData['IMonetaryAmount'], ['median', 'number', SCH('median'), false, true])
addProperty(propData['IMonetaryAmount'], ['percentile10', 'number', SCH('percentile10'), false, true])
addProperty(propData['IMonetaryAmount'], ['percentile25', 'number', SCH('percentile25'), false, true])
addProperty(propData['IMonetaryAmount'], ['percentile75', 'number', SCH('percentile75'), false, true])
addProperty(propData['IMonetaryAmount'], ['percentile90', 'number', SCH('percentile90'), false, true])
addProperty(propData['IMonetaryAmount'], ['validFrom', 'Date', SCH('validFrom'), false, true])
addProperty(propData['IMonetaryAmount'], ['validTo', 'Date', SCH('validTo'), false, true])
addProperty(propData['IMonetaryAmount'], ['value', 'string', SCH('value'), false, true])

typeData.push(['IOccupation', SCH('Occupation'), 'IThing'])
propData['IOccupation'] = {}
addProperty(propData['IOccupation'], ['educationRequirements', 'IThing', SCH('educationRequirements'), false, true])
addProperty(propData['IOccupation'], ['estimatedSalary', 'IMonetaryAmount', SCH('estimatedSalary'), true, true])
addProperty(propData['IOccupation'], ['experienceRequirements', 'IThing', SCH('experienceRequirements'), true, true])
addProperty(propData['IOccupation'], ['occupationLocation', 'IPlace', SCH('occupationLocation'), true, true])
addProperty(propData['IOccupation'], ['occupationalCategory', 'IThing', SCH('occupationalCategory'), true, true])
addProperty(propData['IOccupation'], ['qualifications', 'IThing', SCH('qualifications'), true, true])
addProperty(propData['IOccupation'], ['responsibilities', 'IThing', SCH('responsibilities'), true, true])
addProperty(propData['IOccupation'], ['skills', 'IThing', SCH('skills'), true, true])

typeData.push(['IContactBase', ATX('ContactBase'), 'IThing'])
propData['IContactBase'] = {}
addProperty(propData['IContactBase'], ['address', 'IPostalAddress', SCH('address'), false, true])
addProperty(propData['IContactBase'], ['brand', 'IBrand', SCH('brand'), false, true])
addProperty(propData['IContactBase'], ['email', 'string', SCH('email'), false, true])
addProperty(propData['IContactBase'], ['event', 'IEvent', SCH('event'), true, true])
addProperty(propData['IContactBase'], ['hasOfferCatalog', 'IOfferCatalog', SCH('hasOfferCatalog'), true, true])
addProperty(propData['IContactBase'], ['makesOffer', 'IOffer', SCH('makesOffer'), true, true])
addProperty(propData['IContactBase'], ['memberOf', 'IOrganization', SCH('memberOf'), true, true])
addProperty(propData['IContactBase'], ['seeks', 'IProduct', SCH('seeks'), true, true])
addProperty(propData['IContactBase'], ['telephone', 'string', SCH('telephone'), false, true])
addProperty(propData['IContactBase'], ['taxID', 'string', SCH('taxID'), false, true])
addProperty(propData['IContactBase'], ['vatID', 'string', SCH('vatID'), false, true])

typeData.push(['IPerson', SCH('Person'), 'IContactBase'])
propData['IPerson'] = {}
addProperty(propData['IPerson'], ['affiliation', 'IOrganization', SCH('affiliation'), true, true])
addProperty(propData['IPerson'], ['alumniOf', 'IOrganization', SCH('alumniOf'), true, true])
addProperty(propData['IPerson'], ['award', 'IThing', SCH('award'), true, true])
addProperty(propData['IPerson'], ['birthDate', 'Date', SCH('birthDate'), false, true])
addProperty(propData['IPerson'], ['birthPlace', 'IPlace', SCH('birthPlace'), false, true])
addProperty(propData['IPerson'], ['callSign', 'string', SCH('callSign'), true, true])
addProperty(propData['IPerson'], ['childern', 'IPerson', SCH('childern'), true, true])
addProperty(propData['IPerson'], ['colleague', 'IPerson', SCH('colleague'), true, true])
addProperty(propData['IPerson'], ['familyName', 'string', SCH('familyName'), false, true])
addProperty(propData['IPerson'], ['follows', 'IPerson', SCH('follows'), true, true])
addProperty(propData['IPerson'], ['gender', 'string', SCH('gender'), false, true])
addProperty(propData['IPerson'], ['givenName', 'string', SCH('givenName'), false, true])
addProperty(propData['IPerson'], ['hasOccupation', 'IOccupation', SCH('hasOccupation'), true, true])
addProperty(propData['IPerson'], ['height', 'string', SCH('height'), false, true])
addProperty(propData['IPerson'], ['weight', 'string', SCH('weight'), false, true])
addProperty(propData['IPerson'], ['homeLocation', 'IPlace', SCH('homeLocation'), false, true])
addProperty(propData['IPerson'], ['honorificPrefix', 'string', SCH('honorificPrefix'), false, true])
addProperty(propData['IPerson'], ['honorificSuffix', 'string', SCH('honorificSuffix'), false, true])
addProperty(propData['IPerson'], ['jobTitle', 'string', SCH('jobTitle'), false, true])
addProperty(propData['IPerson'], ['knows', 'IPerson', SCH('knows'), true, true])
addProperty(propData['IPerson'], ['knowsAbout', 'IThing', SCH('knowsAbout'), true, true])
addProperty(propData['IPerson'], ['knowsLanguage', 'string', SCH('knowsLanguage'), true, true])
addProperty(propData['IPerson'], ['owns', 'IProduct', SCH('owns'), true, true])
addProperty(propData['IPerson'], ['relatedTo', 'IPerson', SCH('relatedTo'), true, true])
addProperty(propData['IPerson'], ['sibling', 'IPerson', SCH('sibling'), true, true])
addProperty(propData['IPerson'], ['spouse', 'IPerson', SCH('spouse'), true, true])
addProperty(propData['IPerson'], ['sponsor', 'IOrganization', SCH('sponsor'), true, true])
addProperty(propData['IPerson'], ['workLocation', 'IPlace', SCH('workLocation'), false, true])
addProperty(propData['IPerson'], ['worksFor', 'IOrganization', SCH('worksFor'), true, true])

typeData.push(['IOrganization', SCH('Organization'), 'IContactBase'])
propData['IOrganization'] = {}
addProperty(propData['IOrganization'], ['areaServed', 'IPlace', SCH('areaServed'), true, true])
addProperty(propData['IOrganization'], ['contactPoint', 'IContactPoint', SCH('contactPoint'), true, true])
addProperty(propData['IOrganization'], ['department', 'IOrganization', SCH('department'), true, true])
addProperty(propData['IOrganization'], ['dissolutionDate', 'Date', SCH('dissolutionDate'), false, true])
addProperty(propData['IOrganization'], ['duns', 'string', SCH('duns'), false, true])
addProperty(propData['IOrganization'], ['employee', 'IPerson', SCH('employee'), true, true])
addProperty(propData['IOrganization'], ['founder', 'IPerson', SCH('founder'), true, true])
addProperty(propData['IOrganization'], ['foundingDate', 'Date', SCH('foundingDate'), false, true])
addProperty(propData['IOrganization'], ['foundingLocation', 'IPlace', SCH('foundingLocation'), false, true])
addProperty(propData['IOrganization'], ['funder', 'IOrganization', SCH('funder'), true, true])
addProperty(propData['IOrganization'], ['member', 'IPerson', SCH('member'), true, true])
addProperty(propData['IOrganization'], ['location', 'IPlace', SCH('location'), true, true])
addProperty(propData['IOrganization'], ['numberOfEmployees', 'number', SCH('numberOfEmployees'), true, true])
addProperty(propData['IOrganization'], ['parentOrganization', 'IOrganization', SCH('parentOrganization'), false, true])
addProperty(propData['IOrganization'], ['subOrganization', 'IOrganization', SCH('subOrganization'), true, true])

typeData.push(['IAirline', SCH('Airline'), 'IOrganization'])
propData['IAirline'] = {}

typeData.push(['IConsortium', SCH('Consortium'), 'IOrganization'])
propData['IConsortium'] = {}

typeData.push(['ICorporation', SCH('Corporation'), 'IOrganization'])
propData['ICorporation'] = {}

typeData.push(['IEducationalOrganization', SCH('EducationalOrganization'), 'IOrganization'])
propData['IEducationalOrganization'] = {}

typeData.push(['IGovernmentOrganization', SCH('GovernmentOrganization'), 'IOrganization'])
propData['IGovernmentOrganization'] = {}

typeData.push(['ILibrarySystem', SCH('LibrarySystem'), 'IOrganization'])
propData['ILibrarySystem'] = {}

typeData.push(['ILocalBusiness', SCH('LocalBusiness'), 'IOrganization'])
propData['ILocalBusiness'] = {}

typeData.push(['IMedicalOrganization', SCH('MedicalOrganization'), 'IOrganization'])
propData['IMedicalOrganization'] = {}

typeData.push(['INGO', SCH('NGO'), 'IOrganization'])
propData['INGO'] = {}

typeData.push(['INewsMediaOrganization', SCH('NewsMediaOrganization'), 'IOrganization'])
propData['INewsMediaOrganization'] = {}

typeData.push(['IOnlineBusiness', SCH('OnlineBusiness'), 'IOrganization'])
propData['IOnlineBusiness'] = {}

typeData.push(['IPerformingGroup', SCH('PerformingGroup'), 'IOrganization'])
propData['IPerformingGroup'] = {}

typeData.push(['IProject', SCH('Project'), 'IOrganization'])
propData['IProject'] = {}

typeData.push(['IResearchOrganization', SCH('ResearchOrganization'), 'IOrganization'])
propData['IResearchOrganization'] = {}

typeData.push(['ISearchRescueOrganization', SCH('SearchRescueOrganization'), 'IOrganization'])
propData['ISearchRescueOrganization'] = {}

typeData.push(['ISportsOrganization', SCH('SportsOrganization'), 'IOrganization'])
propData['ISportsOrganization'] = {}

typeData.push(['IWorkersUnion', SCH('WorkersUnion'), 'IOrganization'])
propData['IWorkersUnion'] = {}

typeData.push(['ICollegeOrUniversity', SCH('CollegeOrUniversity'), 'IEducationalOrganization'])
propData['ICollegeOrUniversity'] = {}

typeData.push(['IElementarySchool', SCH('ElementarySchool'), 'IEducationalOrganization'])
propData['IElementarySchool'] = {}

typeData.push(['IHighSchool', SCH('HighSchool'), 'IEducationalOrganization'])
propData['IHighSchool'] = {}

typeData.push(['IMiddleSchool', SCH('MiddleSchool'), 'IEducationalOrganization'])
propData['IMiddleSchool'] = {}

typeData.push(['IPreschool', SCH('Preschool'), 'IEducationalOrganization'])
propData['IPreschool'] = {}

typeData.push(['ISchool', SCH('School'), 'IEducationalOrganization'])
propData['ISchool'] = {}

typeData.push(['IAnimalShelter', SCH('AnimalShelter'), 'ILocalBusiness'])
propData['IAnimalShelter'] = {}

typeData.push(['IArchiveOrganization', SCH('ArchiveOrganization'), 'ILocalBusiness'])
propData['IArchiveOrganization'] = {}

typeData.push(['IAutomotiveBusiness', SCH('AutomotiveBusiness'), 'ILocalBusiness'])
propData['IAutomotiveBusiness'] = {}

typeData.push(['IChildCare', SCH('ChildCare'), 'ILocalBusiness'])
propData['IChildCare'] = {}

typeData.push(['IDentist', SCH('Dentist'), 'ILocalBusiness'])
propData['IDentist'] = {}

typeData.push(['IDryCleaningOrLaundry', SCH('DryCleaningOrLaundry'), 'ILocalBusiness'])
propData['IDryCleaningOrLaundry'] = {}

typeData.push(['IEmergencyService', SCH('EmergencyService'), 'ILocalBusiness'])
propData['IEmergencyService'] = {}

typeData.push(['IEmploymentAgency', SCH('EmploymentAgency'), 'ILocalBusiness'])
propData['IEmploymentAgency'] = {}

typeData.push(['IEntertainmentBusiness', SCH('EntertainmentBusiness'), 'ILocalBusiness'])
propData['IEntertainmentBusiness'] = {}

typeData.push(['IFinancialService', SCH('FinancialService'), 'ILocalBusiness'])
propData['IFinancialService'] = {}

typeData.push(['IFoodEstablishment', SCH('FoodEstablishment'), 'ILocalBusiness'])
propData['IFoodEstablishment'] = {}

typeData.push(['IGovernmentOffice', SCH('GovernmentOffice'), 'ILocalBusiness'])
propData['IGovernmentOffice'] = {}

typeData.push(['IHealthAndBeautyBusiness', SCH('HealthAndBeautyBusiness'), 'ILocalBusiness'])
propData['IHealthAndBeautyBusiness'] = {}

typeData.push(['IHomeAndConstructionBusiness', SCH('HomeAndConstructionBusiness'), 'ILocalBusiness'])
propData['IHomeAndConstructionBusiness'] = {}

typeData.push(['IInternetCafe', SCH('InternetCafe'), 'ILocalBusiness'])
propData['IInternetCafe'] = {}

typeData.push(['ILegalService', SCH('LegalService'), 'ILocalBusiness'])
propData['ILegalService'] = {}

typeData.push(['ILibrary', SCH('Library'), 'ILocalBusiness'])
propData['ILibrary'] = {}

typeData.push(['ILodgingBusiness', SCH('LodgingBusiness'), 'ILocalBusiness'])
propData['ILodgingBusiness'] = {}

typeData.push(['IMedicalBusiness', SCH('MedicalBusiness'), 'ILocalBusiness'])
propData['IMedicalBusiness'] = {}

typeData.push(['IProfessionalService', SCH('ProfessionalService'), 'ILocalBusiness'])
propData['IProfessionalService'] = {}

typeData.push(['IRadioStation', SCH('RadioStation'), 'ILocalBusiness'])
propData['IRadioStation'] = {}

typeData.push(['IRealEstateAgent', SCH('RealEstateAgent'), 'ILocalBusiness'])
propData['IRealEstateAgent'] = {}

typeData.push(['IRecyclingCenter', SCH('RecyclingCenter'), 'ILocalBusiness'])
propData['IRecyclingCenter'] = {}

typeData.push(['ISelfStorage', SCH('SelfStorage'), 'ILocalBusiness'])
propData['ISelfStorage'] = {}

typeData.push(['IShoppingCenter', SCH('ShoppingCenter'), 'ILocalBusiness'])
propData['IShoppingCenter'] = {}

typeData.push(['ISportsActivityLocation', SCH('SportsActivityLocation'), 'ILocalBusiness'])
propData['ISportsActivityLocation'] = {}

typeData.push(['IStore', SCH('Store'), 'ILocalBusiness'])
propData['IStore'] = {}

typeData.push(['ITelevisionStation', SCH('TelevisionStation'), 'ILocalBusiness'])
propData['ITelevisionStation'] = {}

typeData.push(['ITouristInformationCenter', SCH('TouristInformationCenter'), 'ILocalBusiness'])
propData['ITouristInformationCenter'] = {}

typeData.push(['ITravelAgency', SCH('TravelAgency'), 'ILocalBusiness'])
propData['ITravelAgency'] = {}

typeData.push(['ISportsTeam', SCH('SportsTeam'), 'ISportsOrganization'])
propData['ISportsTeam'] = {}

typeData.push(['IResearchProject', SCH('ResearchProject'), 'IProject'])
propData['IResearchProject'] = {}

typeData.push(['IOnlineStore', SCH('OnlineStore'), 'IOnlineBusiness'])
propData['IOnlineStore'] = {}

typeData.push(['ICreativeWork', SCH('CreativeWork'), 'IThing'])
propData['ICreativeWork'] = {}
addProperty(propData['ICreativeWork'], ['about', 'IThing', SCH('about'), false, true])
addProperty(propData['ICreativeWork'], ['abstract', 'string', SCH('abstract'), false, true])
addProperty(propData['ICreativeWork'], ['accessMode', 'string', SCH('accessMode'), false, true])
addProperty(propData['ICreativeWork'], ['accessibilitySummary', 'string', SCH('accessibilitySummary'), false, true])
addProperty(propData['ICreativeWork'], ['alternativeHeadline', 'string', SCH('alternativeHeadline'), false, true])
addProperty(propData['ICreativeWork'], ['archivedAt', 'IThing', SCH('archivedAt'), true, true])
addProperty(propData['ICreativeWork'], ['associatedMedia', 'IMediaObject', SCH('associatedMedia'), true, true])
addProperty(propData['ICreativeWork'], ['audience', 'IThing', SCH('audience'), true, true])
addProperty(propData['ICreativeWork'], ['audio', 'IThing', SCH('audio'), true, true])
addProperty(propData['ICreativeWork'], ['author', ['IPerson', 'IOrganization'], SCH('author'), true, true])
addProperty(propData['ICreativeWork'], ['award', 'string', SCH('award'), true, true])
addProperty(propData['ICreativeWork'], ['character', 'IPerson', SCH('character'), true, true])
addProperty(propData['ICreativeWork'], ['citation', 'ICreativeWork', SCH('citation'), true, true])
addProperty(propData['ICreativeWork'], ['comment', 'string', SCH('comment'), true, true])
addProperty(propData['ICreativeWork'], ['commentCount', 'number', SCH('commentCount'), false, true])
addProperty(propData['ICreativeWork'], ['conditionsOfAccess', 'string', SCH('conditionsOfAccess'), false, true])
addProperty(propData['ICreativeWork'], ['contentLocation', 'IPlace', SCH('contentLocation'), false, true])
addProperty(propData['ICreativeWork'], ['contentRating', 'IThing', SCH('contentRating'), false, true])
addProperty(propData['ICreativeWork'], ['contentReferenceTime', 'Date', SCH('contentReferenceTime'), false, true])
addProperty(propData['ICreativeWork'], ['contributor', ['IPerson', 'IOrganization'], SCH('contributor'), true, true])
addProperty(propData['ICreativeWork'], ['copyrightHolder', ['IPerson', 'IOrganization'], SCH('copyrightHolder'), true, true])
addProperty(propData['ICreativeWork'], ['copyrightNotice', 'string', SCH('copyrightNotice'), false, true])
addProperty(propData['ICreativeWork'], ['copyrightYear', 'number', SCH('copyrightYear'), false, true])
addProperty(propData['ICreativeWork'], ['correction', 'IThing', SCH('correction'), true, true])
addProperty(propData['ICreativeWork'], ['countryOfOrigin', 'string', SCH('countryOfOrigin'), false, true])
addProperty(propData['ICreativeWork'], ['creativeWorkStatus', 'string', SCH('creativeWorkStatus'), false, true])
addProperty(propData['ICreativeWork'], ['creator', ['IPerson', 'IOrganization'], SCH('creator'), true, true])
addProperty(propData['ICreativeWork'], ['creditText', 'string', SCH('creditText'), false, true])
addProperty(propData['ICreativeWork'], ['dateCreated', 'Date', SCH('dateCreated'), false, true])
addProperty(propData['ICreativeWork'], ['dateModified', 'Date', SCH('dateModified'), false, true])
addProperty(propData['ICreativeWork'], ['datePublished', 'Date', SCH('datePublished'), false, true])
addProperty(propData['ICreativeWork'], ['discussionUrl', 'IThing', SCH('discussionUrl'), false, true])
addProperty(propData['ICreativeWork'], ['editor', 'IPerson', SCH('editor'), true, true])
addProperty(propData['ICreativeWork'], ['educationalAlignment', 'IThing', SCH('educationalAlignment'), false, true])
addProperty(propData['ICreativeWork'], ['educationalLevel', 'IThing', SCH('educationalLevel'), false, true])
addProperty(propData['ICreativeWork'], ['educationalUse', 'IThing', SCH('educationalUse'), false, true])
addProperty(propData['ICreativeWork'], ['expires', 'Date', SCH('expires'), false, true])
addProperty(propData['ICreativeWork'], ['funder', ['IPerson', 'IOrganization'], SCH('funder'), true, true])
addProperty(propData['ICreativeWork'], ['funding', 'IThing', SCH('funding'), true, true])
addProperty(propData['ICreativeWork'], ['genre', 'IThing', SCH('genre'), true, true])
addProperty(propData['ICreativeWork'], ['hasPart', 'ICreativeWork', SCH('hasPart'), true, true])
addProperty(propData['ICreativeWork'], ['headline', 'string', SCH('headline'), false, true])
addProperty(propData['ICreativeWork'], ['inLanguage', 'string', SCH('inLanguage'), true, true])
addProperty(propData['ICreativeWork'], ['isAccessibleForFree', 'boolean', SCH('isAccessibleForFree'), false, true])
addProperty(propData['ICreativeWork'], ['isBasedOn', ['IProduct', 'ICreativeWork'], SCH('isBasedOn'), true, true])
addProperty(propData['ICreativeWork'], ['isFamilyFriendly', 'boolean', SCH('isFamilyFriendly'), false, true])
addProperty(propData['ICreativeWork'], ['isPartOf', 'ICreativeWork', SCH('isPartOf'), true, true])
addProperty(propData['ICreativeWork'], ['keyword', 'string', SCH('keyword'), true, true])
addProperty(propData['ICreativeWork'], ['learningResourceType', 'string', SCH('learningResourceType'), true, true])
addProperty(propData['ICreativeWork'], ['license', 'ICreativeWork', SCH('license'), true, true])
addProperty(propData['ICreativeWork'], ['locationCreated', 'IPlace', SCH('locationCreated'), false, true])
addProperty(propData['ICreativeWork'], ['mainEntity', 'IThing', SCH('mainEntity'), false, true])
addProperty(propData['ICreativeWork'], ['maintainer', ['IPerson', 'IOrganization'], SCH('maintainer'), true, true])
addProperty(propData['ICreativeWork'], ['material', 'IThing', SCH('material'), true, true])
addProperty(propData['ICreativeWork'], ['offers', 'IOffer', SCH('offers'), true, true])
addProperty(propData['ICreativeWork'], ['pattern', 'IThing', SCH('pattern'), false, true])
addProperty(propData['ICreativeWork'], ['position', 'number', SCH('position'), false, true])
addProperty(propData['ICreativeWork'], ['producer', ['IPerson', 'IOrganization'], SCH('producer'), true, true])
addProperty(propData['ICreativeWork'], ['provider', ['IPerson', 'IOrganization'], SCH('provider'), true, true])
addProperty(propData['ICreativeWork'], ['publication', 'IThing', SCH('publication'), true, true])
addProperty(propData['ICreativeWork'], ['publisher', ['IPerson', 'IOrganization'], SCH('publisher'), true, true])
addProperty(propData['ICreativeWork'], ['publisherImprint', 'IOrganization', SCH('publisherImprint'), false, true])
addProperty(propData['ICreativeWork'], ['recordedAt', 'IEvent', SCH('recordedAt'), false, true])
addProperty(propData['ICreativeWork'], ['releasedEvent', 'IThing', SCH('releasedEvent'), true, true])
addProperty(propData['ICreativeWork'], ['review', 'IThing', SCH('review'), true, true])
addProperty(propData['ICreativeWork'], ['schemaVersion', 'IThing', SCH('schemaVersion'), false, true])
addProperty(propData['ICreativeWork'], ['size', 'IThing', SCH('size'), false, true])
addProperty(propData['ICreativeWork'], ['sourceOrganization', 'IOrganization', SCH('sourceOrganization'), false, true])
addProperty(propData['ICreativeWork'], ['sponsor', ['IPerson', 'IOrganization'], SCH('sponsor'), true, true])
addProperty(propData['ICreativeWork'], ['thumbnailUrl', 'IMediaObject', SCH('thumbnailUrl'), false, true])
addProperty(propData['ICreativeWork'], ['translator', ['IPerson', 'IOrganization'], SCH('translator'), true, true])
addProperty(propData['ICreativeWork'], ['typicalAgeRange', 'string', SCH('typicalAgeRange'), false, true])
addProperty(propData['ICreativeWork'], ['usageInfo', 'IThing', SCH('usageInfo'), false, true])
addProperty(propData['ICreativeWork'], ['version', 'string', SCH('version'), false, true])
addProperty(propData['ICreativeWork'], ['video', 'IThing', SCH('video'), true, true])
addProperty(propData['ICreativeWork'], ['workExample', 'ICreativeWork', SCH('workExample'), true, true])
addProperty(propData['ICreativeWork'], ['workTranslation', 'ICreativeWork', SCH('workTranslation'), true, true])

typeData.push(['IArchiveComponent', SCH('ArchiveComponent'), 'ICreativeWork'])
propData['IArchiveComponent'] = {}

typeData.push(['IArticle', SCH('Article'), 'ICreativeWork'])
propData['IArticle'] = {}

typeData.push(['IAtlas', SCH('Atlas'), 'ICreativeWork'])
propData['IAtlas'] = {}

typeData.push(['IBlog', SCH('Blog'), 'ICreativeWork'])
propData['IBlog'] = {}

typeData.push(['IBook', SCH('Book'), 'ICreativeWork'])
propData['IBook'] = {}

typeData.push(['IChapter', SCH('Chapter'), 'ICreativeWork'])
propData['IChapter'] = {}

typeData.push(['IClaim', SCH('Claim'), 'ICreativeWork'])
propData['IClaim'] = {}

typeData.push(['IClip', SCH('Clip'), 'ICreativeWork'])
propData['IClip'] = {}

typeData.push(['IComicStory', SCH('ComicStory'), 'ICreativeWork'])
propData['IComicStory'] = {}

typeData.push(['IComment', SCH('Comment'), 'ICreativeWork'])
propData['IComment'] = {}

typeData.push(['IConversation', SCH('Conversation'), 'ICreativeWork'])
propData['IConversation'] = {}

typeData.push(['ICourse', SCH('Course'), 'ICreativeWork'])
propData['ICourse'] = {}

typeData.push(['ICreativeWorkSeason', SCH('CreativeWorkSeason'), 'ICreativeWork'])
propData['ICreativeWorkSeason'] = {}

typeData.push(['ICreativeWorkSeries', SCH('CreativeWorkSeries'), 'ICreativeWork'])
propData['ICreativeWorkSeries'] = {}

typeData.push(['IDataCatalog', SCH('DataCatalog'), 'ICreativeWork'])
propData['IDataCatalog'] = {}

typeData.push(['IDataset', SCH('Dataset'), 'ICreativeWork'])
propData['IDataset'] = {}

typeData.push(['IDiet', SCH('Diet'), 'ICreativeWork'])
propData['IDiet'] = {}

typeData.push(['IDigitalDocument', SCH('DigitalDocument'), 'ICreativeWork'])
propData['IDigitalDocument'] = {}

typeData.push(['IDrawing', SCH('Drawing'), 'ICreativeWork'])
propData['IDrawing'] = {}

typeData.push(['IEpisode', SCH('Episode'), 'ICreativeWork'])
propData['IEpisode'] = {}

typeData.push(['IExercisePlan', SCH('ExercisePlan'), 'ICreativeWork'])
propData['IExercisePlan'] = {}

typeData.push(['IGame', SCH('Game'), 'ICreativeWork'])
propData['IGame'] = {}

typeData.push(['IGuide', SCH('Guide'), 'ICreativeWork'])
propData['IGuide'] = {}

typeData.push(['IHowTo', SCH('HowTo'), 'ICreativeWork'])
propData['IHowTo'] = {}

typeData.push(['IHowToDirection', SCH('HowToDirection'), 'ICreativeWork'])
propData['IHowToDirection'] = {}

typeData.push(['IHowToSection', SCH('HowToSection'), 'ICreativeWork'])
propData['IHowToSection'] = {}

typeData.push(['IHowToStep', SCH('HowToStep'), 'ICreativeWork'])
propData['IHowToStep'] = {}

typeData.push(['IHowToTip', SCH('HowToTip'), 'ICreativeWork'])
propData['IHowToTip'] = {}

typeData.push(['IHyperToc', SCH('HyperToc'), 'ICreativeWork'])
propData['IHyperToc'] = {}

typeData.push(['IHyperTocEntry', SCH('HyperTocEntry'), 'ICreativeWork'])
propData['IHyperTocEntry'] = {}

typeData.push(['ILearningResource', SCH('LearningResource'), 'ICreativeWork'])
propData['ILearningResource'] = {}

typeData.push(['ILegislation', SCH('Legislation'), 'ICreativeWork'])
propData['ILegislation'] = {}

typeData.push(['IManuscript', SCH('Manuscript'), 'ICreativeWork'])
propData['IManuscript'] = {}

typeData.push(['IMap', SCH('Map'), 'ICreativeWork'])
propData['IMap'] = {}

typeData.push(['IMathSolver', SCH('MathSolver'), 'ICreativeWork'])
propData['IMathSolver'] = {}

typeData.push(['IMediaReviewItem', SCH('MediaReviewItem'), 'ICreativeWork'])
propData['IMediaReviewItem'] = {}

typeData.push(['IMenu', SCH('Menu'), 'ICreativeWork'])
propData['IMenu'] = {}

typeData.push(['IMenuSection', SCH('MenuSection'), 'ICreativeWork'])
propData['IMenuSection'] = {}

typeData.push(['IMessage', SCH('Message'), 'ICreativeWork'])
propData['IMessage'] = {}

typeData.push(['IMovie', SCH('Movie'), 'ICreativeWork'])
propData['IMovie'] = {}

typeData.push(['IMusicComposition', SCH('MusicComposition'), 'ICreativeWork'])
propData['IMusicComposition'] = {}

typeData.push(['IMusicPlaylist', SCH('MusicPlaylist'), 'ICreativeWork'])
propData['IMusicPlaylist'] = {}

typeData.push(['IMusicRecording', SCH('MusicRecording'), 'ICreativeWork'])
propData['IMusicRecording'] = {}

typeData.push(['IPainting', SCH('Painting'), 'ICreativeWork'])
propData['IPainting'] = {}

typeData.push(['IPhotograph', SCH('Photograph'), 'ICreativeWork'])
propData['IPhotograph'] = {}

typeData.push(['IPlay', SCH('Play'), 'ICreativeWork'])
propData['IPlay'] = {}

typeData.push(['IPoster', SCH('Poster'), 'ICreativeWork'])
propData['IPoster'] = {}

typeData.push(['IPublicationIssue', SCH('PublicationIssue'), 'ICreativeWork'])
propData['IPublicationIssue'] = {}

typeData.push(['IPublicationVolume', SCH('PublicationVolume'), 'ICreativeWork'])
propData['IPublicationVolume'] = {}

typeData.push(['IQuotation', SCH('Quotation'), 'ICreativeWork'])
propData['IQuotation'] = {}

typeData.push(['IReview', SCH('Review'), 'ICreativeWork'])
propData['IReview'] = {}

typeData.push(['ISculpture', SCH('Sculpture'), 'ICreativeWork'])
propData['ISculpture'] = {}

typeData.push(['ISheetMusic', SCH('SheetMusic'), 'ICreativeWork'])
propData['ISheetMusic'] = {}

typeData.push(['IShortStory', SCH('ShortStory'), 'ICreativeWork'])
propData['IShortStory'] = {}

typeData.push(['ISoftwareApplication', SCH('SoftwareApplication'), 'ICreativeWork'])
propData['ISoftwareApplication'] = {}

typeData.push(['ISoftwareSourceCode', SCH('SoftwareSourceCode'), 'ICreativeWork'])
propData['ISoftwareSourceCode'] = {}

typeData.push(['ISpecialAnnouncement', SCH('SpecialAnnouncement'), 'ICreativeWork'])
propData['ISpecialAnnouncement'] = {}

typeData.push(['IStatement', SCH('Statement'), 'ICreativeWork'])
propData['IStatement'] = {}

typeData.push(['ITVSeason', SCH('TVSeason'), 'ICreativeWork'])
propData['ITVSeason'] = {}

typeData.push(['ITVSeries', SCH('TVSeries'), 'ICreativeWork'])
propData['ITVSeries'] = {}

typeData.push(['IThesis', SCH('Thesis'), 'ICreativeWork'])
propData['IThesis'] = {}

typeData.push(['IVisualArtwork', SCH('VisualArtwork'), 'ICreativeWork'])
propData['IVisualArtwork'] = {}

typeData.push(['IWebContent', SCH('WebContent'), 'ICreativeWork'])
propData['IWebContent'] = {}

typeData.push(['IWebPage', SCH('WebPage'), 'ICreativeWork'])
propData['IWebPage'] = {}

typeData.push(['IWebPageElement', SCH('WebPageElement'), 'ICreativeWork'])
propData['IWebPageElement'] = {}

typeData.push(['IWebSite', SCH('WebSite'), 'ICreativeWork'])
propData['IWebSite'] = {}

typeData.push(['IConcept', SKOS('Concept'), 'IThing'])
propData['IConcept'] = {}
addProperty(propData['IConcept'], ['broader', 'IConcept', SKOS('broader'), false, true])
addProperty(propData['IConcept'], ['narrower', 'IConcept', SKOS('narrower'), true, true])
addProperty(propData['IConcept'], ['related', 'IConcept', SKOS('related'), true, true])
addProperty(propData['IConcept'], ['note', 'string', SKOS('note'), false, true])
addProperty(propData['IConcept'], ['definition', 'string', SKOS('definition'), false, true])
addProperty(propData['IConcept'], ['example', 'IThing', SKOS('example'), false, true])
addProperty(propData['IConcept'], ['prefLabel', 'string', SKOS('prefLabel'), false, true])
addProperty(propData['IConcept'], ['altLabel', 'string', SKOS('altLabel'), true, true])

typeData.push(['IConceptScheme', SKOS('ConceptScheme'), 'IThing'])
propData['IConceptScheme'] = {}
addProperty(propData['IConceptScheme'], ['hasTopConcept', 'IConcept', SKOS('hasTopConcept'), true, true])

typeData.push(['ICollection', SKOS('Collection'), 'ICreativeWork'])
propData['ICollection'] = {}
addProperty(propData['ICollection'], ['member', 'IConcept', SKOS('member'), true, true])
addProperty(propData['ICollection'], ['total', 'number', ATX('Collection.total'), false, true])
addProperty(propData['ICollection'], ['filters', 'IThing', ATX('Collection.filters'), true, true])

typeData.push(['IOrderedCollection', SKOS('OrderedCollection'), 'IThing'])
propData['IOrderedCollection'] = {}
addProperty(propData['IOrderedCollection'], ['memberList', 'IConcept', SKOS('memberList'), true, true])
addProperty(propData['IOrderedCollection'], ['total', 'number', ATX('Collection.total'), false, true])
addProperty(propData['IOrderedCollection'], ['limit', 'number', ATX('Collection.limit'), false, true])
addProperty(propData['IOrderedCollection'], ['page', 'number', ATX('Collection.page'), false, true])
addProperty(propData['IOrderedCollection'], ['pages', 'number', ATX('Collection.pages'), false, true])
addProperty(propData['IOrderedCollection'], ['from', 'number', ATX('Collection.from'), false, true])
addProperty(propData['IOrderedCollection'], ['to', 'number', ATX('Collection.to'), false, true])
addProperty(propData['IOrderedCollection'], ['sort', 'string', ATX('Collection.sort'), false, true])
addProperty(propData['IOrderedCollection'], ['filters', 'IThing', ATX('Collection.filters'), true, true])

typeData.push(['IResume', ATX('Resume'), 'IObject'])
propData['IResume'] = {}
addProperty(propData['IResume'], ['uuid', 'string', ATX('Object.uuid'), false, true])
addProperty(propData['IResume'], ['basics', 'IResumeBasics', ATX('Resume.basics'), true, true])
addProperty(propData['IResume'], ['work', 'IResumeWork', ATX('Resume.work'), true, true])
addProperty(propData['IResume'], ['volunteer', 'IResumeVolunteer', ATX('Resume.volunteer'), true, true])
addProperty(propData['IResume'], ['education', 'IResumeEducation', ATX('Resume.education'), true, true])
addProperty(propData['IResume'], ['awards', 'IResumeAward', ATX('Resume.awards'), true, true])
addProperty(propData['IResume'], ['certificates', 'IResumeCertificate', ATX('Resume.certificates'), true, true])
addProperty(propData['IResume'], ['publications', 'IResumePublication', ATX('Resume.publications'), true, true])
addProperty(propData['IResume'], ['skills', 'IResumeSkill', ATX('Resume.skills'), true, true])
addProperty(propData['IResume'], ['languages', 'IResumeLanguage', ATX('Resume.languages'), true, true])
addProperty(propData['IResume'], ['interests', 'IResumeInterest', ATX('Resume.interests'), true, true])
addProperty(propData['IResume'], ['references', 'IResumeReference', ATX('Resume.references'), true, true])
addProperty(propData['IResume'], ['projects', 'IResumeProject', ATX('Resume.projects'), true, true])

typeData.push(['IResumeBasics', ATX('ResumeBasics'), 'IObject'])
propData['IResumeBasics'] = {}
addProperty(propData['IResumeBasics'], ['uuid', 'string', ATX('Object.uuid'), false, true])
addProperty(propData['IResumeBasics'], ['name', 'string', ATX('ResumeBasics.name'), false, true])
addProperty(propData['IResumeBasics'], ['label', 'string', ATX('ResumeBasics.label'), false, true])
addProperty(propData['IResumeBasics'], ['image', 'IMediaObject', ATX('ResumeBasics.image'), false, true])
addProperty(propData['IResumeBasics'], ['email', 'string', ATX('ResumeBasics.email'), false, true])
addProperty(propData['IResumeBasics'], ['phone', 'string', ATX('ResumeBasics.phone'), false, true])
addProperty(propData['IResumeBasics'], ['url', 'string', ATX('ResumeBasics.url'), false, true])
addProperty(propData['IResumeBasics'], ['summary', 'string', ATX('ResumeBasics.summary'), false, true])
addProperty(propData['IResumeBasics'], ['location', 'IResumeLocation', ATX('ResumeBasics.location'), false, true])
addProperty(propData['IResumeBasics'], ['profiles', 'IResumeProfile', ATX('ResumeBasics.profiles'), true, true])

typeData.push(['IResumeLocation', ATX('ResumeLocation'), 'IObject'])
propData['IResumeLocation'] = {}
addProperty(propData['IResumeLocation'], ['uuid', 'string', ATX('Object.uuid'), false, true])
addProperty(propData['IResumeLocation'], ['address', 'string', ATX('ResumeLocation.address'), false, true])
addProperty(propData['IResumeLocation'], ['postalCode', 'string', ATX('ResumeLocation.postalCode'), false, true])
addProperty(propData['IResumeLocation'], ['city', 'string', ATX('ResumeLocation.city'), false, true])
addProperty(propData['IResumeLocation'], ['countryCode', 'string', ATX('ResumeLocation.countryCode'), false, true])
addProperty(propData['IResumeLocation'], ['region', 'string', ATX('ResumeLocation.region'), false, true])

typeData.push(['IResumeProfile', ATX('ResumeProfile'), 'IObject'])
propData['IResumeProfile'] = {}
addProperty(propData['IResumeProfile'], ['uuid', 'string', ATX('Object.uuid'), false, true])
addProperty(propData['IResumeProfile'], ['network', 'string', ATX('ResumeProfile.network'), false, true])
addProperty(propData['IResumeProfile'], ['username', 'string', ATX('ResumeProfile.username'), false, true])
addProperty(propData['IResumeProfile'], ['url', 'string', ATX('ResumeProfile.url'), false, true])

typeData.push(['IResumeWork', ATX('ResumeWork'), 'IObject'])
propData['IResumeWork'] = {}
addProperty(propData['IResumeWork'], ['uuid', 'string', ATX('Object.uuid'), false, true])
addProperty(propData['IResumeWork'], ['name', 'string', ATX('ResumeWork.name'), false, true])
addProperty(propData['IResumeWork'], ['position', 'string', ATX('ResumeWork.position'), false, true])
addProperty(propData['IResumeWork'], ['url', 'string', ATX('ResumeWork.url'), false, true])
addProperty(propData['IResumeWork'], ['startDate', 'Date', ATX('ResumeWork.startDate'), false, true])
addProperty(propData['IResumeWork'], ['endDate', 'Date', ATX('ResumeWork.endDate'), false, true])
addProperty(propData['IResumeWork'], ['summary', 'Date', ATX('ResumeWork.summary'), false, true])
addProperty(propData['IResumeWork'], ['highlights', 'string', ATX('ResumeWork.highlights'), true, true])

typeData.push(['IResumeVolunteer', ATX('ResumeVolunteer'), 'IObject'])
propData['IResumeVolunteer'] = {}
addProperty(propData['IResumeVolunteer'], ['uuid', 'string', ATX('Object.uuid'), false, true])
addProperty(propData['IResumeVolunteer'], ['organization', 'string', ATX('ResumeVolunteer.organization'), false, true])
addProperty(propData['IResumeVolunteer'], ['position', 'string', ATX('ResumeVolunteer.position'), false, true])
addProperty(propData['IResumeVolunteer'], ['url', 'string', ATX('ResumeVolunteer.url'), false, true])
addProperty(propData['IResumeVolunteer'], ['startDate', 'Date', ATX('ResumeVolunteer.startDate'), false, true])
addProperty(propData['IResumeVolunteer'], ['endDate', 'Date', ATX('ResumeVolunteer.endDate'), false, true])
addProperty(propData['IResumeVolunteer'], ['summary', 'string', ATX('ResumeVolunteer.summary'), false, true])
addProperty(propData['IResumeVolunteer'], ['highlights', 'string', ATX('ResumeVolunteer.highlights'), true, true])

typeData.push(['IResumeEducation', ATX('ResumeEducation'), 'IObject'])
propData['IResumeEducation'] = {}
addProperty(propData['IResumeEducation'], ['uuid', 'string', ATX('Object.uuid'), false, true])
addProperty(propData['IResumeEducation'], ['institution', 'string', ATX('ResumeEducation.institution'), false, true])
addProperty(propData['IResumeEducation'], ['url', 'string', ATX('ResumeEducation.url'), false, true])
addProperty(propData['IResumeEducation'], ['area', 'string', ATX('ResumeEducation.area'), false, true])
addProperty(propData['IResumeEducation'], ['studyType', 'string', ATX('ResumeEducation.studyType'), false, true])
addProperty(propData['IResumeEducation'], ['startDate', 'Date', ATX('ResumeEducation.startDate'), false, true])
addProperty(propData['IResumeEducation'], ['endDate', 'Date', ATX('ResumeEducation.endDate'), false, true])
addProperty(propData['IResumeEducation'], ['score', 'string', ATX('ResumeEducation.score'), false, true])
addProperty(propData['IResumeEducation'], ['courses', 'string', ATX('ResumeEducation.courses'), true, true])

typeData.push(['IResumeAward', ATX('ResumeAward'), 'IObject'])
propData['IResumeAward'] = {}
addProperty(propData['IResumeAward'], ['uuid', 'string', ATX('Object.uuid'), false, true])
addProperty(propData['IResumeAward'], ['title', 'string', ATX('ResumeAward.title'), false, true])
addProperty(propData['IResumeAward'], ['date', 'Date', ATX('ResumeAward.date'), false, true])
addProperty(propData['IResumeAward'], ['awarder', 'string', ATX('ResumeAward.awarder'), false, true])
addProperty(propData['IResumeAward'], ['summary', 'string', ATX('ResumeAward.summary'), false, true])

typeData.push(['IResumeCertificate', ATX('ResumeCertificate'), 'IObject'])
propData['IResumeCertificate'] = {}
addProperty(propData['IResumeCertificate'], ['uuid', 'string', ATX('Object.uuid'), false, true])
addProperty(propData['IResumeCertificate'], ['name', 'string', ATX('ResumeCertificate.name'), false, true])
addProperty(propData['IResumeCertificate'], ['date', 'Date', ATX('ResumeCertificate.date'), false, true])
addProperty(propData['IResumeCertificate'], ['issuer', 'string', ATX('ResumeCertificate.issuer'), false, true])
addProperty(propData['IResumeCertificate'], ['url', 'string', ATX('ResumeCertificate.url'), false, true])

typeData.push(['IResumePublication', ATX('ResumePublication'), 'IObject'])
propData['IResumePublication'] = {}
addProperty(propData['IResumePublication'], ['uuid', 'string', ATX('Object.uuid'), false, true])
addProperty(propData['IResumePublication'], ['name', 'string', ATX('ResumePublication.name'), false, true])
addProperty(propData['IResumePublication'], ['publisher', 'string', ATX('ResumePublication.publisher'), false, true])
addProperty(propData['IResumePublication'], ['releaseDate', 'Date', ATX('ResumePublication.releaseDate'), false, true])
addProperty(propData['IResumePublication'], ['url', 'string', ATX('ResumePublication.url'), false, true])
addProperty(propData['IResumePublication'], ['summmary', 'string', ATX('ResumePublication.summmary'), false, true])

typeData.push(['IResumeSkill', ATX('ResumeSkill'), 'IObject'])
propData['IResumeSkill'] = {}
addProperty(propData['IResumeSkill'], ['uuid', 'string', ATX('Object.uuid'), false, true])
addProperty(propData['IResumeSkill'], ['name', 'string', ATX('ResumeSkill.name'), false, true])
addProperty(propData['IResumeSkill'], ['level', 'string', ATX('ResumeSkill.level'), false, true])
addProperty(propData['IResumeSkill'], ['keywords', 'string', ATX('ResumeSkill.keywords'), true, true])

typeData.push(['IResumeLanguage', ATX('ResumeLanguage'), 'IObject'])
propData['IResumeLanguage'] = {}
addProperty(propData['IResumeLanguage'], ['uuid', 'string', ATX('Object.uuid'), false, true])
addProperty(propData['IResumeLanguage'], ['language', 'string', ATX('ResumeLanguage.language'), false, true])
addProperty(propData['IResumeLanguage'], ['fluency', 'string', ATX('ResumeLanguage.fluency'), false, true])

typeData.push(['IResumeInterest', ATX('ResumeInterest'), 'IObject'])
propData['IResumeInterest'] = {}
addProperty(propData['IResumeInterest'], ['uuid', 'string', ATX('Object.uuid'), false, true])
addProperty(propData['IResumeInterest'], ['name', 'string', ATX('ResumeInterest.name'), false, true])
addProperty(propData['IResumeInterest'], ['keywords', 'string', ATX('ResumeInterest.keywords'), false, true])

typeData.push(['IResumeReference', ATX('ResumeReference'), 'IObject'])
propData['IResumeReference'] = {}
addProperty(propData['IResumeReference'], ['uuid', 'string', ATX('Object.uuid'), false, true])
addProperty(propData['IResumeReference'], ['name', 'string', ATX('ResumeReference.name'), false, true])
addProperty(propData['IResumeReference'], ['reference', 'string', ATX('ResumeReference.reference'), false, true])
addProperty(propData['IResumeReference'], ['email', 'string', ATX('ResumeReference.email'), false, true])
addProperty(propData['IResumeReference'], ['phone', 'string', ATX('ResumeReference.phone'), false, true])

typeData.push(['IResumeProject', ATX('ResumeProject'), 'IObject'])
propData['IResumeProject'] = {}
addProperty(propData['IResumeProject'], ['uuid', 'string', ATX('Object.uuid'), false, true])
addProperty(propData['IResumeProject'], ['name', 'string', ATX('ResumeProject.name'), false, true])
addProperty(propData['IResumeProject'], ['startDate', 'Date', ATX('ResumeProject.startDate'), false, true])
addProperty(propData['IResumeProject'], ['endDate', 'Date', ATX('ResumeProject.endDate'), false, true])
addProperty(propData['IResumeProject'], ['summary', 'Date', ATX('ResumeProject.summary'), false, true])
addProperty(propData['IResumeProject'], ['highlights', 'string', ATX('ResumeProject.highlights'), true, true])
addProperty(propData['IResumeProject'], ['url', 'string', ATX('ResumeProject.url'), false, true])

typeData.push(['IJobPosting', SCH('JobPosting'), 'IThing'])
propData['IJobPosting'] = {}
addProperty(propData['IJobPosting'], ['uuid', 'string', ATX('Object.uuid'), false, true])
addProperty(propData['IJobPosting'], ['applicantLocationRequirements', 'IPlace', SCH('applicantLocationRequirements'), false, true])
addProperty(propData['IJobPosting'], ['applicationContact', 'IContactPoint', SCH('applicationContact'), false, true])
addProperty(propData['IJobPosting'], ['baseSalary', 'IMonetaryAmount', SCH('baseSalary'), false, true])
addProperty(propData['IJobPosting'], ['datePosted', 'Date', SCH('datePosted'), false, true])
addProperty(propData['IJobPosting'], ['directApply', 'boolean', SCH('directApply'), false, true])
addProperty(propData['IJobPosting'], ['educationalRequirements', 'IEducationalOccupationalCredential', SCH('educationalRequirements'), true, true])
addProperty(propData['IJobPosting'], ['eligibilityToWorkRequirement', 'string', SCH('eligibilityToWorkRequirement'), false, true])
addProperty(propData['IJobPosting'], ['employerOverview', 'string', SCH('employerOverview'), false, true])
addProperty(propData['IJobPosting'], ['employmentType', 'string', SCH('employmentType'), false, true])
addProperty(propData['IJobPosting'], ['employmentUnit', 'IOrganization', SCH('employmentUnit'), false, true])
addProperty(propData['IJobPosting'], ['estimatedSalary', 'IMonetaryAmount', SCH('estimatedSalary'), false, true])
addProperty(propData['IJobPosting'], ['experienceInPlaceOfEducation', 'boolean', SCH('experienceInPlaceOfEducation'), false, true])
addProperty(propData['IJobPosting'], ['experienceRequirements', 'IOccupationalExperienceRequirements', SCH('experienceRequirements'), true, true])
addProperty(propData['IJobPosting'], ['hiringOrganization', ['IPerson', 'IOrganization'], SCH('hiringOrganization'), false, true])
addProperty(propData['IJobPosting'], ['incentiveCompensation', 'string', SCH('incentiveCompensation'), false, true])
addProperty(propData['IJobPosting'], ['industry', 'IDefinedTerm', SCH('industry'), false, true])
addProperty(propData['IJobPosting'], ['jobBenefits', 'string', SCH('jobBenefits'), false, true])
addProperty(propData['IJobPosting'], ['jobImmediateStart', 'boolean', SCH('jobImmediateStart'), false, true])
addProperty(propData['IJobPosting'], ['jobLocation', 'IPlace', SCH('jobLocation'), false, true])
addProperty(propData['IJobPosting'], ['jobLocationType', 'string', SCH('jobLocationType'), false, true])
addProperty(propData['IJobPosting'], ['jobStartDate', 'Date', SCH('jobStartDate'), false, true])
addProperty(propData['IJobPosting'], ['occupationalCategory', 'IThing', SCH('occupationalCategory'), false, true])
addProperty(propData['IJobPosting'], ['physicalRequirement', 'IThing', SCH('physicalRequirement'), false, true])
addProperty(propData['IJobPosting'], ['qualifications', 'IEducationalOccupationalCredential', SCH('qualifications'), false, true])
addProperty(propData['IJobPosting'], ['relevantOccupation', 'IOccupation', SCH('relevantOccupation'), false, true])
addProperty(propData['IJobPosting'], ['responsibilities', 'string', SCH('responsibilities'), false, true])
addProperty(propData['IJobPosting'], ['salaryCurrency', 'string', SCH('salaryCurrency'), false, true])
addProperty(propData['IJobPosting'], ['securityClearanceRequirement', 'IThing', SCH('securityClearanceRequirement'), false, true])
addProperty(propData['IJobPosting'], ['sensoryRequirement', 'IThing', SCH('sensoryRequirement'), false, true])
addProperty(propData['IJobPosting'], ['skills', 'string', SCH('skills'), true, true])
addProperty(propData['IJobPosting'], ['specialCommitments', 'string', SCH('specialCommitments'), false, true])
addProperty(propData['IJobPosting'], ['title', 'string', SCH('title'), false, true])
addProperty(propData['IJobPosting'], ['totalJobOpenings', 'number', SCH('specialCommitments'), false, true])
addProperty(propData['IJobPosting'], ['validThrough', 'Date', SCH('validThrough'), false, true])
addProperty(propData['IJobPosting'], ['workHours', 'string', SCH('workHours'), false, true])

typeData.push(['IEducationalOccupationalCredential', SCH('EducationalOccupationalCredential'), 'ICreativeWork'])
propData['IEducationalOccupationalCredential'] = {}
addProperty(propData['IEducationalOccupationalCredential'], ['competencyRequired', 'IThing', SCH('competencyRequired'), false, true])
addProperty(propData['IEducationalOccupationalCredential'], ['credentialCategory', 'IThing', SCH('credentialCategory'), false, true])
addProperty(propData['IEducationalOccupationalCredential'], ['educationalLevel', 'IThing', SCH('educationalLevel'), false, true])
addProperty(propData['IEducationalOccupationalCredential'], ['recognizedBy', 'IOrganization', SCH('recognizedBy'), false, true])
addProperty(propData['IEducationalOccupationalCredential'], ['validFor', 'string', SCH('validFor'), false, true])
addProperty(propData['IEducationalOccupationalCredential'], ['validIn', 'IPlace', SCH('validId'), false, true])

typeData.push(['IOccupationalExperienceRequirements', SCH('OccupationalExperienceRequirements'), 'IThing'])
propData['IOccupationalExperienceRequirements'] = {}
addProperty(propData['IOccupationalExperienceRequirements'], ['monthsOfExperience', 'number', SCH('monthsOfExperience'), false, true])

export const abstractDefinitions: AbstractDefinition[] = buildDefinitions(typeData)
export const abstractDefinitionMap: AbstractDefinitionMap = mapDefinitions(abstractDefinitions)

