export interface IObject {
    id?: string
    type?: string
}
export interface IThing extends IObject {
    uuid?: string
    name?: string
    identifier?: string
    additionalType?: Array<IThing>
    alternateName?: Array<string>
    description?: string
    image?: Array<IMediaObject>
    url?: string
    sameAs?: Array<IThing>
    subjectOf?: Array<IThing>
    mainEntityOfPage?: Array<IThing>
    potentialAction?: Array<IAction>
}
export interface IAction extends IThing {
    actionStatus?: IThing
    agent?: IOrganization | IPerson
    startTime?: Date
    endTime?: Date
    error?: IThing
    instrument?: IThing
    location?: IPlace
    object?: IThing
    participant?: IOrganization | IPerson
    result?: IThing
    target?: IThing
}
export interface IAchieveAction extends IAction {
}
export interface ILoseAction extends IAction {
}
export interface ITieAction extends IAction {
}
export interface IWinAction extends IAction {
}
export interface IAssessAction extends IAction {
}
export interface IChooseAction extends IAction {
}
export interface IIgnoreAction extends IAction {
}
export interface IReactAction extends IAction {
}
export interface IReviewAction extends IAction {
}
export interface IAgreeAction extends IAction {
}
export interface IDisagreeAction extends IAction {
}
export interface IDislikeAction extends IAction {
}
export interface IEndorseAction extends IAction {
}
export interface ILikeAction extends IAction {
}
export interface IWantAction extends IAction {
}
export interface IVoteAction extends IAction {
}
export interface IDrinkAction extends IAction {
}
export interface IEatAction extends IAction {
}
export interface IInstallAction extends IAction {
}
export interface IListenAction extends IAction {
}
export interface IPlayGameAction extends IAction {
}
export interface IReadAction extends IAction {
}
export interface IUseAction extends IAction {
}
export interface IViewAction extends IAction {
}
export interface IWatchAction extends IAction {
}
export interface IControlAction extends IAction {
}
export interface ICreateAction extends IAction {
}
export interface IActivateAction extends IAction {
}
export interface IDeactivateAction extends IAction {
}
export interface IResumeAction extends IAction {
}
export interface ISuspendAction extends IAction {
}
export interface IFindAction extends IAction {
}
export interface ICheckAction extends IAction {
}
export interface IDiscoverAction extends IAction {
}
export interface ITrackAction extends IAction {
}
export interface IInteractAction extends IAction {
}
export interface IBefriendAction extends IAction {
}
export interface ICommunicateAction extends IAction {
}
export interface IFollowAction extends IAction {
}
export interface IJoinAction extends IAction {
}
export interface ILeaveAction extends IAction {
}
export interface IMarryAction extends IAction {
}
export interface IRegisterAction extends IAction {
}
export interface ISubscribeAction extends IAction {
}
export interface IUnRegisterAction extends IAction {
}
export interface IMoveAction extends IAction {
}
export interface IArriveAction extends IAction {
}
export interface IDepartAction extends IAction {
}
export interface ITravelAction extends IAction {
}
export interface IOrganizeAction extends IAction {
}
export interface IAllocateAction extends IAction {
}
export interface IApplyAction extends IAction {
}
export interface IBookmarkAction extends IAction {
}
export interface IPlanAction extends IAction {
}
export interface IPlayAction extends IAction {
}
export interface ISearchAction extends IAction {
}
export interface ISeekToAction extends IAction {
}
export interface ISolveMathAction extends IAction {
}
export interface ITradeAction extends IAction {
}
export interface IBuyAction extends IAction {
}
export interface IDonateAction extends IAction {
}
export interface IOrderAction extends IAction {
}
export interface IPayAction extends IAction {
}
export interface IPreOrderAction extends IAction {
}
export interface IQuoteAction extends IAction {
}
export interface IRentAction extends IAction {
}
export interface ISellAction extends IAction {
}
export interface ITipAction extends IAction {
}
export interface ITransferAction extends IAction {
}
export interface IBorrowAction extends IAction {
}
export interface IDownloadAction extends IAction {
}
export interface IGiveAction extends IAction {
}
export interface ILendAction extends IAction {
}
export interface IMoneyTransfer extends IAction {
}
export interface IReceiveAction extends IAction {
}
export interface IReturnAction extends IAction {
}
export interface ISendAction extends IAction {
}
export interface ITakeAction extends IAction {
}
export interface IUpdateAction extends IAction {
}
export interface IAddAction extends IAction {
}
export interface IDeleteAction extends IAction {
}
export interface IReplaceAction extends IAction {
}
export interface IMediaObject extends IThing {
    associatedArticle?: IThing
    bitrate?: string
    contentSize?: string
    contentUrl?: string
    duration?: string
    embedUrl?: string
    encodesCreativeWork?: IThing
    startTime?: Date
    endTime?: Date
    height?: number
    width?: number
    playerType?: string
    productionCompany?: Array<IOrganization>
    requiresSubscription?: Array<boolean>
    uploadDate?: Date
}
export interface IBrand extends IThing {
    slug?: string
}
export interface IDefinedTermSet extends IThing {
    hasDefinedTerm?: Array<IDefinedTerm>
}
export interface IDefinedTerm extends IThing {
}
export interface IPropertyValue extends IThing {
    maxValue?: number
    minValue?: number
    propertyID?: IDefinedTermSet
    unitCode?: string
    unitText?: string
    value?: IDefinedTerm
    valueReference?: IThing
}
export interface IService extends IThing {
    aggregateRating?: IThing
    areaServed?: IPlace
    audience?: IThing
    availableChannel?: IThing
    award?: string
    brand?: IBrand
    category?: IThing
    hasOfferCatalog?: IOfferCatalog
    hoursAvailable?: IThing
    isRelatedTo?: IProduct | IService
    isSimilarTo?: IProduct | IService
    logo?: IMediaObject
    offers?: Array<IOffer>
    provider?: IOrganization | IPerson
    providerMobility?: string
    review?: Array<IThing>
    serviceOutput?: Array<IThing>
    serviceType?: IThing
    slogan?: string
    termsOfService?: IThing
}
export interface IService extends IThing {
    aggregateRating?: IThing
    areaServed?: IPlace
    audience?: IThing
    availableChannel?: IThing
    award?: string
    brand?: IBrand
    category?: IThing
    hasOfferCatalog?: IOfferCatalog
    hoursAvailable?: IThing
    isRelatedTo?: IProduct | IService
    isSimilarTo?: IProduct | IService
    logo?: IMediaObject
    offers?: Array<IOffer>
    provider?: IOrganization | IPerson
    providerMobility?: string
    review?: Array<IThing>
    serviceOutput?: Array<IThing>
    serviceType?: IThing
    slogan?: string
    termsOfService?: IThing
}
export interface IProduct extends IThing {
    sku?: string
    slug?: string
    brand?: IBrand
    model?: IThing
    material?: IThing
    logo?: IMediaObject
    size?: string
    color?: string
    height?: string
    width?: string
    depth?: string
    weight?: string
    productID?: string
    releaseDate?: Date
    countryOfOrigin?: IThing
    offers?: Array<IOffer>
    keywords?: Array<string>
    additionalProperty?: Array<IPropertyValue>
}
export interface IProductGroup extends IProduct {
    hasVariant?: Array<IProduct>
    productGroupID?: string
    variesBy?: string
}
export interface IOffer extends IThing {
    acceptedPaymentMethod?: Array<IPaymentMethod>
    addOn?: Array<IOffer>
    advanceBookingRequirement?: string
    areaServed?: IPlace
    availability?: string
    availabilityStarts?: Date
    availabilityEnds?: Date
    availableAtOrFrom?: Date
    availableDeliveryMethod?: Array<IDeliveryMethod>
    businessFunction?: IThing
    category?: IThing
    deliveryLeadTime?: string
    eligibleCustomerType?: IThing
    eligibleDuration?: string
    eligibleQuantity?: number
    eligibleRegion?: Array<IPlace>
    eligibleTransactionVolume?: number
    hasAdultConsideration?: boolean
    inventoryLevel?: number
    isFamilyFriendly?: boolean
    itemCondition?: IThing
    itemOffered?: IProduct
    leaseLength?: string
    offeredBy?: IPerson | IOrganization
    price?: number
    priceCurrency?: string
    priceSpecification?: IPriceSpecification
    serialNumber?: string
    sku?: string
    validFrom?: Date
    validThrough?: Date
    warranty?: IThing
}
export interface IPriceSpecification extends IThing {
    price?: number
    priceCurrency?: string
    maxPrice?: number
    minPrice?: number
    eligibleQuantity?: number
    eligibleTransactionVolume?: number
    validFrom?: Date
    validThrough?: Date
    valueAddedTaxIncluded?: boolean
}
export interface IOfferCatalog extends IThing {
    numberOfItems?: number
    itemList?: Array<IOffer>
}
export interface IOrder extends IThing {
    acceptedOffer?: Array<IOffer>
    billingAddress?: IPostalAddress
    broker?: IPerson | IOrganization
    confirmationNumber?: string
    customer?: IPerson | IOrganization
    discount?: number
    discountCode?: string
    discountCurrency?: string
    isGift?: boolean
    orderDate?: Date
    orderDelivery?: Array<IParcelDelivery>
    orderNumber?: Array<string>
    orderStatus?: Array<IOrderStatus>
    orderedItem?: Array<IOrderItem>
    partOfInvoice?: IInvoice
    paymentDueDate?: Date
    paymentMethod?: Array<IPaymentMethod>
    paymentMethodId?: Array<string>
    paymentUrl?: Array<IThing>
    seller?: IThing
}
export interface IPaymentMethod extends IThing {
}
export interface IParcelDelivery extends IThing {
    deliveryAddress?: IPostalAddress
}
export interface IOrderItem extends IThing {
    orderDelivery?: IParcelDelivery
    orderItemNumber?: string
    orderItemStatus?: IOrderStatus
    orderQuantity?: number
    orderedItem?: IProduct | IService
}
export interface IOrderStatus extends IThing {
}
export interface IInvoice extends IThing {
    accountId?: string
    billingPeriod?: string
    broker?: IPerson | IOrganization
    category?: IThing
    confirmationNumber?: string
    customer?: IPerson | IOrganization
    minimumPaymentDue?: IPriceSpecification
    paymentDueDate?: Date
    paymentMethod?: Array<IPaymentMethod>
    paymentMethodId?: Array<string>
    paymentStatus?: Array<string>
    provider?: IPerson | IOrganization
    referencesOrder?: IOrder
    scheduledPaymentDate?: Date
    totalPaymentDue?: IPriceSpecification
}
export interface IEvent extends IThing {
    about?: IThing
    actor?: Array<IPerson>
    attendee?: Array<IPerson>
    audience?: Array<IThing>
    contributor?: Array<IPerson | IOrganization>
    director?: Array<IPerson>
    duration?: string
    funder?: Array<IPerson | IOrganization>
    startDate?: Date
    endDate?: Date
    eventAttendanceMode?: IThing
    eventSchedule?: IThing
    eventStatus?: IThing
    inLanguage?: Array<IThing>
    isAccessibleForFree?: boolean
    keywords?: Array<string>
    location?: Array<IPlace>
    maximumAttendeeCapacity?: number
    maximumPhysicalAttendeeCapacity?: number
    maximumVirtualAttendeeCapacity?: number
    remainingmAttendeeCapacity?: number
    offers?: Array<IOffer>
    organizer?: Array<IPerson | IOrganization>
    sponsor?: Array<IPerson | IOrganization>
    performer?: Array<IPerson | IOrganization>
    translator?: Array<IPerson | IOrganization>
    subEvent?: Array<IEvent>
    superEvent?: Array<IEvent>
    recordedIn?: Array<IThing>
    workFeatured?: Array<IThing>
    workPerformed?: Array<IThing>
}
export interface IDeliveryEvent extends IEvent {
    accessCode?: string
    availableFrom?: Date
    availableThrough?: Date
    hasDeliveryMethod?: IDeliveryMethod
}
export interface IDeliveryMethod extends IThing {
}
export interface IContactPoint extends IThing {
    areaServed?: Array<IPlace>
    contactType?: string
    email?: string
    faxNumber?: string
    hoursAvailable?: IThing
    productsSupported?: Array<IProduct>
    telephone?: string
}
export interface IPostalAddress extends IContactPoint {
    addressCountry?: string
    addressLocality?: string
    addressRegion?: string
    postOfficeBoxNumber?: string
    postalCode?: string
    streetAddress?: string
}
export interface IGeoCoordinates extends IThing {
    address?: IPostalAddress
    elevation?: string
    latitude?: string
    longitude?: string
}
export interface IPlace extends IThing {
    additionalProperty?: Array<IThing>
    address?: IPostalAddress
    branchCode?: string
    containedInPlace?: IPlace
    containsPlace?: Array<IPlace>
    event?: Array<IEvent>
    faxNumber?: string
    telephone?: string
    geo?: IGeoCoordinates
    geoContains?: Array<IPlace>
    geoCoveredBy?: Array<IPlace>
    geoCovers?: Array<IPlace>
    geoCrosses?: Array<IPlace>
    geoDisjoint?: Array<IPlace>
    geoEquals?: Array<IPlace>
    geoIntersects?: Array<IPlace>
    geoOverlaps?: Array<IPlace>
    geoTouces?: Array<IPlace>
    geoWithin?: Array<IPlace>
    globalLocationNumber?: string
    hasDriveThroughService?: boolean
    hasMap?: IThing
    isAccessibleForFree?: boolean
    keywords?: Array<string>
    latitude?: string
    longitude?: string
    logo?: IMediaObject
    photo?: IMediaObject
    publicAccess?: boolean
    slogan?: string
    smokingAllowed?: boolean
    tourBookingPage?: IThing
}
export interface IAccommodation extends IPlace {
    accommodationFloorPlan?: IThing
    tourBookingPage?: IThing
    numberOfBedrooms?: number
}
export interface IApartmentComplex extends IAccommodation {
    numberOfAccommodationUnits?: number
    numberOfAvailableAccommodationUnits?: number
    petsAllowed?: boolean
}
export interface IGatedResidenceCommunity extends IAccommodation {
}
export interface IAdministrativeArea extends IPlace {
}
export interface ICivicStructure extends IPlace {
}
export interface IAirport extends ICivicStructure {
}
export interface IAquarium extends ICivicStructure {
}
export interface IBeach extends ICivicStructure {
}
export interface IBoatTerminal extends ICivicStructure {
}
export interface IBridge extends ICivicStructure {
}
export interface IBusStation extends ICivicStructure {
}
export interface IBusStop extends ICivicStructure {
}
export interface ICampground extends ICivicStructure {
}
export interface ICemetery extends ICivicStructure {
}
export interface ICrematorium extends ICivicStructure {
}
export interface IEventVenue extends ICivicStructure {
}
export interface IFireStation extends ICivicStructure {
}
export interface IGovernmentBuilding extends ICivicStructure {
}
export interface IHospital extends ICivicStructure {
}
export interface IMovieTheater extends ICivicStructure {
}
export interface IMuseum extends ICivicStructure {
}
export interface IMusicVenue extends ICivicStructure {
}
export interface IPark extends ICivicStructure {
}
export interface IParkingFacility extends ICivicStructure {
}
export interface IPerformingArtsTheater extends ICivicStructure {
}
export interface IPlaceOfWorship extends ICivicStructure {
}
export interface IPlayground extends ICivicStructure {
}
export interface IPoliceStation extends ICivicStructure {
}
export interface IPublicToilet extends ICivicStructure {
}
export interface IRVPark extends ICivicStructure {
}
export interface IStadiumOrArena extends ICivicStructure {
}
export interface ISubwayStation extends ICivicStructure {
}
export interface ITaxiStand extends ICivicStructure {
}
export interface ITrainStation extends ICivicStructure {
}
export interface IZoo extends ICivicStructure {
}
export interface ICityHall extends IGovernmentBuilding {
}
export interface ICourthouse extends IGovernmentBuilding {
}
export interface IDefenceEstablishment extends IGovernmentBuilding {
}
export interface IEmbassy extends IGovernmentBuilding {
}
export interface ILegislativeBuilding extends IGovernmentBuilding {
}
export interface IBuddhistTemple extends IPlaceOfWorship {
}
export interface IChurch extends IPlaceOfWorship {
}
export interface IHinduTemple extends IPlaceOfWorship {
}
export interface IMosque extends IPlaceOfWorship {
}
export interface ISynagogue extends IPlaceOfWorship {
}
export interface ILandform extends IPlace {
}
export interface IBodyOfWater extends ILandform {
}
export interface IContinent extends ILandform {
}
export interface IMountain extends ILandform {
}
export interface IVolcano extends ILandform {
}
export interface ILandmarksOrHistoricalBuildings extends IPlace {
}
export interface IResidence extends IPlace {
}
export interface ITouristAttraction extends IPlace {
}
export interface ITouristDestination extends IPlace {
}
export interface IMonetaryAmount extends IThing {
    currency?: string
    duration?: string
    minValue?: number
    maxValue?: number
    median?: number
    percentile10?: number
    percentile25?: number
    percentile75?: number
    percentile90?: number
    validFrom?: Date
    validTo?: Date
    value?: string
}
export interface IOccupation extends IThing {
    educationRequirements?: IThing
    estimatedSalary?: Array<IMonetaryAmount>
    experienceRequirements?: Array<IThing>
    occupationLocation?: Array<IPlace>
    occupationalCategory?: Array<IThing>
    qualifications?: Array<IThing>
    responsibilities?: Array<IThing>
    skills?: Array<IThing>
}
export interface IContactBase extends IThing {
    address?: IPostalAddress
    brand?: IBrand
    email?: string
    event?: Array<IEvent>
    hasOfferCatalog?: Array<IOfferCatalog>
    makesOffer?: Array<IOffer>
    memberOf?: Array<IOrganization>
    seeks?: Array<IProduct>
    telephone?: string
    taxID?: string
    vatID?: string
}
export interface IPerson extends IContactBase {
    affiliation?: Array<IOrganization>
    alumniOf?: Array<IOrganization>
    award?: Array<IThing>
    birthDate?: Date
    birthPlace?: IPlace
    callSign?: Array<string>
    childern?: Array<IPerson>
    colleague?: Array<IPerson>
    familyName?: string
    follows?: Array<IPerson>
    gender?: string
    givenName?: string
    hasOccupation?: Array<IOccupation>
    height?: string
    weight?: string
    homeLocation?: IPlace
    honorificPrefix?: string
    honorificSuffix?: string
    jobTitle?: string
    knows?: Array<IPerson>
    knowsAbout?: Array<IThing>
    knowsLanguage?: Array<string>
    owns?: Array<IProduct>
    relatedTo?: Array<IPerson>
    sibling?: Array<IPerson>
    spouse?: Array<IPerson>
    sponsor?: Array<IOrganization>
    workLocation?: IPlace
    worksFor?: Array<IOrganization>
}
export interface IOrganization extends IContactBase {
    areaServed?: Array<IPlace>
    contactPoint?: Array<IContactPoint>
    department?: Array<IOrganization>
    dissolutionDate?: Date
    duns?: string
    employee?: Array<IPerson>
    founder?: Array<IPerson>
    foundingDate?: Date
    foundingLocation?: IPlace
    funder?: Array<IOrganization>
    member?: Array<IPerson>
    location?: Array<IPlace>
    numberOfEmployees?: Array<number>
    parentOrganization?: IOrganization
    subOrganization?: Array<IOrganization>
}
export interface IAirline extends IOrganization {
}
export interface IConsortium extends IOrganization {
}
export interface ICorporation extends IOrganization {
}
export interface IEducationalOrganization extends IOrganization {
}
export interface IGovernmentOrganization extends IOrganization {
}
export interface ILibrarySystem extends IOrganization {
}
export interface ILocalBusiness extends IOrganization {
}
export interface IMedicalOrganization extends IOrganization {
}
export interface INGO extends IOrganization {
}
export interface INewsMediaOrganization extends IOrganization {
}
export interface IOnlineBusiness extends IOrganization {
}
export interface IPerformingGroup extends IOrganization {
}
export interface IProject extends IOrganization {
}
export interface IResearchOrganization extends IOrganization {
}
export interface ISearchRescueOrganization extends IOrganization {
}
export interface ISportsOrganization extends IOrganization {
}
export interface IWorkersUnion extends IOrganization {
}
export interface ICollegeOrUniversity extends IEducationalOrganization {
}
export interface IElementarySchool extends IEducationalOrganization {
}
export interface IHighSchool extends IEducationalOrganization {
}
export interface IMiddleSchool extends IEducationalOrganization {
}
export interface IPreschool extends IEducationalOrganization {
}
export interface ISchool extends IEducationalOrganization {
}
export interface IAnimalShelter extends ILocalBusiness {
}
export interface IArchiveOrganization extends ILocalBusiness {
}
export interface IAutomotiveBusiness extends ILocalBusiness {
}
export interface IChildCare extends ILocalBusiness {
}
export interface IDentist extends ILocalBusiness {
}
export interface IDryCleaningOrLaundry extends ILocalBusiness {
}
export interface IEmergencyService extends ILocalBusiness {
}
export interface IEmploymentAgency extends ILocalBusiness {
}
export interface IEntertainmentBusiness extends ILocalBusiness {
}
export interface IFinancialService extends ILocalBusiness {
}
export interface IFoodEstablishment extends ILocalBusiness {
}
export interface IGovernmentOffice extends ILocalBusiness {
}
export interface IHealthAndBeautyBusiness extends ILocalBusiness {
}
export interface IHomeAndConstructionBusiness extends ILocalBusiness {
}
export interface IInternetCafe extends ILocalBusiness {
}
export interface ILegalService extends ILocalBusiness {
}
export interface ILibrary extends ILocalBusiness {
}
export interface ILodgingBusiness extends ILocalBusiness {
}
export interface IMedicalBusiness extends ILocalBusiness {
}
export interface IProfessionalService extends ILocalBusiness {
}
export interface IRadioStation extends ILocalBusiness {
}
export interface IRealEstateAgent extends ILocalBusiness {
}
export interface IRecyclingCenter extends ILocalBusiness {
}
export interface ISelfStorage extends ILocalBusiness {
}
export interface IShoppingCenter extends ILocalBusiness {
}
export interface ISportsActivityLocation extends ILocalBusiness {
}
export interface IStore extends ILocalBusiness {
}
export interface ITelevisionStation extends ILocalBusiness {
}
export interface ITouristInformationCenter extends ILocalBusiness {
}
export interface ITravelAgency extends ILocalBusiness {
}
export interface ISportsTeam extends ISportsOrganization {
}
export interface IResearchProject extends IProject {
}
export interface IOnlineStore extends IOnlineBusiness {
}
export interface ICreativeWork extends IThing {
    about?: IThing
    abstract?: string
    accessMode?: string
    accessibilitySummary?: string
    alternativeHeadline?: string
    archivedAt?: Array<IThing>
    associatedMedia?: Array<IMediaObject>
    audience?: Array<IThing>
    audio?: Array<IThing>
    author?: Array<IPerson | IOrganization>
    award?: Array<string>
    character?: Array<IPerson>
    citation?: Array<ICreativeWork>
    comment?: Array<string>
    commentCount?: number
    conditionsOfAccess?: string
    contentLocation?: IPlace
    contentRating?: IThing
    contentReferenceTime?: Date
    contributor?: Array<IPerson | IOrganization>
    copyrightHolder?: Array<IPerson | IOrganization>
    copyrightNotice?: string
    copyrightYear?: number
    correction?: Array<IThing>
    countryOfOrigin?: string
    creativeWorkStatus?: string
    creator?: Array<IPerson | IOrganization>
    creditText?: string
    dateCreated?: Date
    dateModified?: Date
    datePublished?: Date
    discussionUrl?: IThing
    editor?: Array<IPerson>
    educationalAlignment?: IThing
    educationalLevel?: IThing
    educationalUse?: IThing
    expires?: Date
    funder?: Array<IPerson | IOrganization>
    funding?: Array<IThing>
    genre?: Array<IThing>
    hasPart?: Array<ICreativeWork>
    headline?: string
    inLanguage?: Array<string>
    isAccessibleForFree?: boolean
    isBasedOn?: Array<IProduct | ICreativeWork>
    isFamilyFriendly?: boolean
    isPartOf?: Array<ICreativeWork>
    keyword?: Array<string>
    learningResourceType?: Array<string>
    license?: Array<ICreativeWork>
    locationCreated?: IPlace
    mainEntity?: IThing
    maintainer?: Array<IPerson | IOrganization>
    material?: Array<IThing>
    offers?: Array<IOffer>
    pattern?: IThing
    position?: number
    producer?: Array<IPerson | IOrganization>
    provider?: Array<IPerson | IOrganization>
    publication?: Array<IThing>
    publisher?: Array<IPerson | IOrganization>
    publisherImprint?: IOrganization
    recordedAt?: IEvent
    releasedEvent?: Array<IThing>
    review?: Array<IThing>
    schemaVersion?: IThing
    size?: IThing
    sourceOrganization?: IOrganization
    sponsor?: Array<IPerson | IOrganization>
    thumbnailUrl?: IMediaObject
    translator?: Array<IPerson | IOrganization>
    typicalAgeRange?: string
    usageInfo?: IThing
    version?: string
    video?: Array<IThing>
    workExample?: Array<ICreativeWork>
    workTranslation?: Array<ICreativeWork>
}
export interface IArchiveComponent extends ICreativeWork {
}
export interface IArticle extends ICreativeWork {
}
export interface IAtlas extends ICreativeWork {
}
export interface IBlog extends ICreativeWork {
}
export interface IBook extends ICreativeWork {
}
export interface IChapter extends ICreativeWork {
}
export interface IClaim extends ICreativeWork {
}
export interface IClip extends ICreativeWork {
}
export interface ICollection extends ICreativeWork {
    member?: Array<IConcept>
    total?: number
    filters?: Array<IThing>
}
export interface IComicStory extends ICreativeWork {
}
export interface IComment extends ICreativeWork {
}
export interface IConversation extends ICreativeWork {
}
export interface ICourse extends ICreativeWork {
}
export interface ICreativeWorkSeason extends ICreativeWork {
}
export interface ICreativeWorkSeries extends ICreativeWork {
}
export interface IDataCatalog extends ICreativeWork {
}
export interface IDataset extends ICreativeWork {
}
export interface IDiet extends ICreativeWork {
}
export interface IDigitalDocument extends ICreativeWork {
}
export interface IDrawing extends ICreativeWork {
}
export interface IEducationalOccupationalCredential extends ICreativeWork {
}
export interface IEpisode extends ICreativeWork {
}
export interface IExercisePlan extends ICreativeWork {
}
export interface IGame extends ICreativeWork {
}
export interface IGuide extends ICreativeWork {
}
export interface IHowTo extends ICreativeWork {
}
export interface IHowToDirection extends ICreativeWork {
}
export interface IHowToSection extends ICreativeWork {
}
export interface IHowToStep extends ICreativeWork {
}
export interface IHowToTip extends ICreativeWork {
}
export interface IHyperToc extends ICreativeWork {
}
export interface IHyperTocEntry extends ICreativeWork {
}
export interface ILearningResource extends ICreativeWork {
}
export interface ILegislation extends ICreativeWork {
}
export interface IManuscript extends ICreativeWork {
}
export interface IMap extends ICreativeWork {
}
export interface IMathSolver extends ICreativeWork {
}
export interface IMediaReviewItem extends ICreativeWork {
}
export interface IMenu extends ICreativeWork {
}
export interface IMenuSection extends ICreativeWork {
}
export interface IMessage extends ICreativeWork {
}
export interface IMovie extends ICreativeWork {
}
export interface IMusicComposition extends ICreativeWork {
}
export interface IMusicPlaylist extends ICreativeWork {
}
export interface IMusicRecording extends ICreativeWork {
}
export interface IPainting extends ICreativeWork {
}
export interface IPhotograph extends ICreativeWork {
}
export interface IPlay extends ICreativeWork {
}
export interface IPoster extends ICreativeWork {
}
export interface IPublicationIssue extends ICreativeWork {
}
export interface IPublicationVolume extends ICreativeWork {
}
export interface IQuotation extends ICreativeWork {
}
export interface IReview extends ICreativeWork {
}
export interface ISculpture extends ICreativeWork {
}
export interface ISheetMusic extends ICreativeWork {
}
export interface IShortStory extends ICreativeWork {
}
export interface ISoftwareApplication extends ICreativeWork {
}
export interface ISoftwareSourceCode extends ICreativeWork {
}
export interface ISpecialAnnouncement extends ICreativeWork {
}
export interface IStatement extends ICreativeWork {
}
export interface ITVSeason extends ICreativeWork {
}
export interface ITVSeries extends ICreativeWork {
}
export interface IThesis extends ICreativeWork {
}
export interface IVisualArtwork extends ICreativeWork {
}
export interface IWebContent extends ICreativeWork {
}
export interface IWebPage extends ICreativeWork {
}
export interface IWebPageElement extends ICreativeWork {
}
export interface IWebSite extends ICreativeWork {
}
export interface IConcept extends IThing {
    broader?: IConcept
    narrower?: Array<IConcept>
    related?: Array<IConcept>
    note?: string
    definition?: string
    example?: IThing
    prefLabel?: string
    altLabel?: Array<string>
}
export interface IConceptScheme extends IThing {
    hasTopConcept?: Array<IConcept>
}
export interface ICollection extends IThing {
    member?: Array<IConcept>
    total?: number
    filters?: Array<IThing>
}
export interface IOrderedCollection extends IThing {
    memberList?: Array<IConcept>
    total?: number
    limit?: number
    page?: number
    pages?: number
    from?: number
    to?: number
    sort?: string
    filters?: Array<IThing>
}
export interface IResume extends IObject {
    uuid?: string
    basics?: Array<IResumeBasics>
    work?: Array<IResumeWork>
    volunteer?: Array<IResumeVolunteer>
    education?: Array<IResumeEducation>
    awards?: Array<IResumeAward>
    certificates?: Array<IResumeCertificate>
    publications?: Array<IResumePublication>
    skills?: Array<IResumeSkill>
    languages?: Array<IResumeLanguage>
    interests?: Array<IResumeInterest>
    references?: Array<IResumeReference>
    projects?: Array<IResumeProject>
}
export interface IResumeBasics extends IObject {
    uuid?: string
    name?: string
    label?: string
    image?: IMediaObject
    email?: string
    phone?: string
    url?: string
    summary?: string
    location?: IResumeLocation
    profiles?: Array<IResumeProfile>
}
export interface IResumeLocation extends IObject {
    uuid?: string
    address?: string
    postalCode?: string
    city?: string
    countryCode?: string
    region?: string
}
export interface IResumeProfile extends IObject {
    uuid?: string
    network?: string
    username?: string
    url?: string
}
export interface IResumeWork extends IObject {
    uuid?: string
    name?: string
    position?: string
    url?: string
    startDate?: Date
    endDate?: Date
    summary?: Date
    highlights?: Array<string>
}
export interface IResumeVolunteer extends IObject {
    uuid?: string
    organization?: string
    position?: string
    url?: string
    startDate?: Date
    endDate?: Date
    summary?: string
    highlights?: Array<string>
}
export interface IResumeEducation extends IObject {
    uuid?: string
    institution?: string
    url?: string
    area?: string
    studyType?: string
    startDate?: Date
    endDate?: Date
    score?: string
    courses?: Array<string>
}
export interface IResumeAward extends IObject {
    uuid?: string
    title?: string
    date?: Date
    awarder?: string
    summary?: string
}
export interface IResumeCertificate extends IObject {
    uuid?: string
    name?: string
    date?: Date
    issuer?: string
    url?: string
}
export interface IResumePublication extends IObject {
    uuid?: string
    name?: string
    publisher?: string
    releaseDate?: Date
    url?: string
    summmary?: string
}
export interface IResumeSkill extends IObject {
    uuid?: string
    name?: string
    level?: string
    keywords?: Array<string>
}
export interface IResumeLanguage extends IObject {
    uuid?: string
    language?: string
    fluency?: string
}
export interface IResumeInterest extends IObject {
    uuid?: string
    name?: string
    keywords?: string
}
export interface IResumeReference extends IObject {
    uuid?: string
    name?: string
    reference?: string
    email?: string
    phone?: string
}
export interface IResumeProject extends IObject {
    uuid?: string
    name?: string
    startDate?: Date
    endDate?: Date
    summary?: Date
    highlights?: Array<string>
    url?: string
}
