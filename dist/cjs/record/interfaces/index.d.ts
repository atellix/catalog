/** @hidden */
export interface IObject {
    id?: string;
    type?: string;
}
/** @category Types */
export interface IThing extends IObject {
    uuid?: string;
    name?: string;
    identifier?: string;
    additionalType?: Array<IThing>;
    alternateName?: Array<string>;
    description?: string;
    image?: Array<IMediaObject>;
    url?: string;
    sameAs?: Array<IThing>;
    subjectOf?: Array<IThing>;
    mainEntityOfPage?: Array<IThing>;
    potentialAction?: Array<IAction>;
}
/** @category Types */
export interface IAction extends IThing {
    actionStatus?: IThing;
    agent?: IOrganization | IPerson;
    startTime?: Date;
    endTime?: Date;
    error?: IThing;
    instrument?: IThing;
    location?: IPlace;
    object?: IThing;
    participant?: IOrganization | IPerson;
    result?: IThing;
    target?: IThing;
}
/** @category Types */
export interface IAchieveAction extends IAction {
}
/** @category Types */
export interface ILoseAction extends IAction {
}
/** @category Types */
export interface ITieAction extends IAction {
}
/** @category Types */
export interface IWinAction extends IAction {
}
/** @category Types */
export interface IAssessAction extends IAction {
}
/** @category Types */
export interface IChooseAction extends IAction {
}
/** @category Types */
export interface IIgnoreAction extends IAction {
}
/** @category Types */
export interface IReactAction extends IAction {
}
/** @category Types */
export interface IReviewAction extends IAction {
}
/** @category Types */
export interface IAgreeAction extends IAction {
}
/** @category Types */
export interface IDisagreeAction extends IAction {
}
/** @category Types */
export interface IDislikeAction extends IAction {
}
/** @category Types */
export interface IEndorseAction extends IAction {
}
/** @category Types */
export interface ILikeAction extends IAction {
}
/** @category Types */
export interface IWantAction extends IAction {
}
/** @category Types */
export interface IVoteAction extends IAction {
}
/** @category Types */
export interface IDrinkAction extends IAction {
}
/** @category Types */
export interface IEatAction extends IAction {
}
/** @category Types */
export interface IInstallAction extends IAction {
}
/** @category Types */
export interface IListenAction extends IAction {
}
/** @category Types */
export interface IPlayGameAction extends IAction {
}
/** @category Types */
export interface IReadAction extends IAction {
}
/** @category Types */
export interface IUseAction extends IAction {
}
/** @category Types */
export interface IViewAction extends IAction {
}
/** @category Types */
export interface IWatchAction extends IAction {
}
/** @category Types */
export interface IControlAction extends IAction {
}
/** @category Types */
export interface ICreateAction extends IAction {
}
/** @category Types */
export interface IActivateAction extends IAction {
}
/** @category Types */
export interface IDeactivateAction extends IAction {
}
/** @category Types */
export interface IResumeAction extends IAction {
}
/** @category Types */
export interface ISuspendAction extends IAction {
}
/** @category Types */
export interface IFindAction extends IAction {
}
/** @category Types */
export interface ICheckAction extends IAction {
}
/** @category Types */
export interface IDiscoverAction extends IAction {
}
/** @category Types */
export interface ITrackAction extends IAction {
}
/** @category Types */
export interface IInteractAction extends IAction {
}
/** @category Types */
export interface IBefriendAction extends IAction {
}
/** @category Types */
export interface ICommunicateAction extends IAction {
}
/** @category Types */
export interface IFollowAction extends IAction {
}
/** @category Types */
export interface IJoinAction extends IAction {
}
/** @category Types */
export interface ILeaveAction extends IAction {
}
/** @category Types */
export interface IMarryAction extends IAction {
}
/** @category Types */
export interface IRegisterAction extends IAction {
}
/** @category Types */
export interface ISubscribeAction extends IAction {
}
/** @category Types */
export interface IUnRegisterAction extends IAction {
}
/** @category Types */
export interface IMoveAction extends IAction {
}
/** @category Types */
export interface IArriveAction extends IAction {
}
/** @category Types */
export interface IDepartAction extends IAction {
}
/** @category Types */
export interface ITravelAction extends IAction {
}
/** @category Types */
export interface IOrganizeAction extends IAction {
}
/** @category Types */
export interface IAllocateAction extends IAction {
}
/** @category Types */
export interface IApplyAction extends IAction {
}
/** @category Types */
export interface IBookmarkAction extends IAction {
}
/** @category Types */
export interface IPlanAction extends IAction {
}
/** @category Types */
export interface IPlayAction extends IAction {
}
/** @category Types */
export interface ISearchAction extends IAction {
}
/** @category Types */
export interface ISeekToAction extends IAction {
}
/** @category Types */
export interface ISolveMathAction extends IAction {
}
/** @category Types */
export interface ITradeAction extends IAction {
    price?: string;
    priceCurrency?: string;
    priceSpecification?: IPriceSpecification;
}
/** @category Types */
export interface IBuyAction extends ITradeAction {
    seller?: IPerson | IOrganization;
}
/** @category Types */
export interface IDonateAction extends IAction {
}
/** @category Types */
export interface IOrderAction extends IAction {
}
/** @category Types */
export interface IPayAction extends IAction {
}
/** @category Types */
export interface IPreOrderAction extends IAction {
}
/** @category Types */
export interface IQuoteAction extends IAction {
}
/** @category Types */
export interface IRentAction extends IAction {
}
/** @category Types */
export interface ISellAction extends IAction {
}
/** @category Types */
export interface ITipAction extends IAction {
}
/** @category Types */
export interface ITransferAction extends IAction {
}
/** @category Types */
export interface IBorrowAction extends IAction {
}
/** @category Types */
export interface IDownloadAction extends IAction {
}
/** @category Types */
export interface IGiveAction extends IAction {
}
/** @category Types */
export interface ILendAction extends IAction {
}
/** @category Types */
export interface IMoneyTransfer extends IAction {
}
/** @category Types */
export interface IReceiveAction extends IAction {
}
/** @category Types */
export interface IReturnAction extends IAction {
}
/** @category Types */
export interface ISendAction extends IAction {
}
/** @category Types */
export interface ITakeAction extends IAction {
}
/** @category Types */
export interface IUpdateAction extends IAction {
}
/** @category Types */
export interface IAddAction extends IAction {
}
/** @category Types */
export interface IDeleteAction extends IAction {
}
/** @category Types */
export interface IReplaceAction extends IAction {
}
/** @category Types */
export interface IMediaObject extends IThing {
    associatedArticle?: IThing;
    bitrate?: string;
    contentSize?: string;
    contentUrl?: string;
    duration?: string;
    embedUrl?: string;
    encodesCreativeWork?: IThing;
    startTime?: Date;
    endTime?: Date;
    height?: number;
    width?: number;
    playerType?: string;
    productionCompany?: Array<IOrganization>;
    requiresSubscription?: Array<boolean>;
    uploadDate?: Date;
}
/** @category Types */
export interface IBrand extends IThing {
    slug?: string;
}
/** @category Types */
export interface IDefinedTermSet extends IThing {
    hasDefinedTerm?: Array<IDefinedTerm>;
}
/** @category Types */
export interface IDefinedTerm extends IThing {
    inDefinedTermSet?: IDefinedTermSet;
    termCode?: string;
}
/** @category Types */
export interface ICategoryCodeSet extends IDefinedTermSet {
    hasCategoryCode?: Array<ICategoryCode>;
}
/** @category Types */
export interface ICategoryCode extends IDefinedTerm {
    codeValue?: string;
    inCodeSet?: ICategoryCodeSet;
}
/** @category Types */
export interface IPropertyValue extends IThing {
    maxValue?: number;
    minValue?: number;
    propertyID?: IDefinedTermSet;
    unitCode?: string;
    unitText?: string;
    value?: IDefinedTerm;
    valueReference?: IThing;
}
/** @category Types */
export interface IService extends IThing {
    aggregateRating?: IThing;
    areaServed?: IPlace;
    audience?: IThing;
    availableChannel?: IThing;
    award?: string;
    brand?: IBrand;
    category?: IThing;
    hasOfferCatalog?: IOfferCatalog;
    hoursAvailable?: IThing;
    isRelatedTo?: IProduct | IService;
    isSimilarTo?: IProduct | IService;
    logo?: IMediaObject;
    offers?: Array<IOffer>;
    provider?: IOrganization | IPerson;
    providerMobility?: string;
    review?: Array<IThing>;
    serviceOutput?: Array<IThing>;
    serviceType?: IThing;
    slogan?: string;
    termsOfService?: IThing;
}
/** @category Types */
export interface IServiceChannel extends IThing {
    availableLanguage?: IThing;
    processingTime?: string;
    providesService?: IService;
    serviceLocation?: IPlace;
    servicePhone?: IContactPoint;
    servicePostalAddress?: IPostalAddress;
    serviceSmsNumber?: IContactPoint;
    serviceUrl?: IThing;
}
/** @category Types */
export interface IProduct extends IThing {
    sku?: string;
    slug?: string;
    brand?: IBrand;
    model?: IThing;
    material?: IThing;
    logo?: IMediaObject;
    size?: string;
    color?: string;
    height?: string;
    width?: string;
    depth?: string;
    weight?: string;
    productID?: string;
    releaseDate?: Date;
    countryOfOrigin?: IThing;
    offers?: Array<IOffer>;
    keywords?: Array<string>;
    additionalProperty?: Array<IPropertyValue>;
}
/** @category Types */
export interface IProductGroup extends IProduct {
    hasVariant?: Array<IProduct>;
    productGroupID?: string;
    variesBy?: string;
}
/** @category Types */
export interface IOffer extends IThing {
    acceptedPaymentMethod?: Array<IPaymentMethod>;
    addOn?: Array<IOffer>;
    advanceBookingRequirement?: string;
    areaServed?: IPlace;
    availability?: string;
    availabilityStarts?: Date;
    availabilityEnds?: Date;
    availableAtOrFrom?: Date;
    availableDeliveryMethod?: Array<IDeliveryMethod>;
    businessFunction?: IThing;
    category?: IThing;
    deliveryLeadTime?: string;
    eligibleCustomerType?: IThing;
    eligibleDuration?: string;
    eligibleQuantity?: number;
    eligibleRegion?: Array<IPlace>;
    eligibleTransactionVolume?: number;
    hasAdultConsideration?: boolean;
    inventoryLevel?: number;
    isFamilyFriendly?: boolean;
    itemCondition?: IThing;
    itemOffered?: IProduct;
    leaseLength?: string;
    offeredBy?: IPerson | IOrganization;
    price?: number;
    priceCurrency?: string;
    priceSpecification?: IPriceSpecification;
    seller?: IPerson | IOrganization;
    serialNumber?: string;
    sku?: string;
    validFrom?: Date;
    validThrough?: Date;
    warranty?: IThing;
}
/** @category Types */
export interface IPriceSpecification extends IThing {
    price?: number;
    priceCurrency?: string;
    maxPrice?: number;
    minPrice?: number;
    eligibleQuantity?: number;
    eligibleTransactionVolume?: number;
    validFrom?: Date;
    validThrough?: Date;
    valueAddedTaxIncluded?: boolean;
}
/** @category Types */
export interface IOfferCatalog extends IThing {
    numberOfItems?: number;
    itemList?: Array<IOffer>;
}
/** @category Types */
export interface IOrder extends IThing {
    acceptedOffer?: Array<IOffer>;
    billingAddress?: IPostalAddress;
    broker?: IPerson | IOrganization;
    confirmationNumber?: string;
    customer?: IPerson | IOrganization;
    discount?: number;
    discountCode?: string;
    discountCurrency?: string;
    isGift?: boolean;
    orderDate?: Date;
    orderDelivery?: Array<IParcelDelivery>;
    orderNumber?: Array<string>;
    orderStatus?: Array<IOrderStatus>;
    orderedItem?: Array<IOrderItem>;
    partOfInvoice?: IInvoice;
    paymentDueDate?: Date;
    paymentMethod?: Array<IPaymentMethod>;
    paymentMethodId?: Array<string>;
    paymentUrl?: Array<IThing>;
    seller?: IThing;
}
/** @category Types */
export interface IPaymentMethod extends IThing {
}
/** @category Types */
export interface IParcelDelivery extends IThing {
    deliveryAddress?: IPostalAddress;
}
/** @category Types */
export interface IOrderItem extends IThing {
    orderDelivery?: IParcelDelivery;
    orderItemNumber?: string;
    orderItemStatus?: IOrderStatus;
    orderQuantity?: number;
    orderedItem?: IProduct | IService;
}
/** @category Types */
export interface IOrderStatus extends IThing {
}
/** @category Types */
export interface IInvoice extends IThing {
    accountId?: string;
    billingPeriod?: string;
    broker?: IPerson | IOrganization;
    category?: IThing;
    confirmationNumber?: string;
    customer?: IPerson | IOrganization;
    minimumPaymentDue?: IPriceSpecification;
    paymentDueDate?: Date;
    paymentMethod?: Array<IPaymentMethod>;
    paymentMethodId?: Array<string>;
    paymentStatus?: Array<string>;
    provider?: IPerson | IOrganization;
    referencesOrder?: IOrder;
    scheduledPaymentDate?: Date;
    totalPaymentDue?: IPriceSpecification;
}
/** @category Types */
export interface IEvent extends IThing {
    about?: IThing;
    actor?: Array<IPerson>;
    attendee?: Array<IPerson>;
    audience?: Array<IThing>;
    contributor?: Array<IPerson | IOrganization>;
    director?: Array<IPerson>;
    duration?: string;
    funder?: Array<IPerson | IOrganization>;
    startDate?: Date;
    endDate?: Date;
    eventAttendanceMode?: IThing;
    eventSchedule?: IThing;
    eventStatus?: IThing;
    inLanguage?: Array<IThing>;
    isAccessibleForFree?: boolean;
    keywords?: Array<string>;
    location?: Array<IPlace>;
    maximumAttendeeCapacity?: number;
    maximumPhysicalAttendeeCapacity?: number;
    maximumVirtualAttendeeCapacity?: number;
    remainingmAttendeeCapacity?: number;
    offers?: Array<IOffer>;
    organizer?: Array<IPerson | IOrganization>;
    sponsor?: Array<IPerson | IOrganization>;
    performer?: Array<IPerson | IOrganization>;
    translator?: Array<IPerson | IOrganization>;
    subEvent?: Array<IEvent>;
    superEvent?: Array<IEvent>;
    recordedIn?: Array<IThing>;
    workFeatured?: Array<IThing>;
    workPerformed?: Array<IThing>;
}
/** @category Types */
export interface IDeliveryEvent extends IEvent {
    accessCode?: string;
    availableFrom?: Date;
    availableThrough?: Date;
    hasDeliveryMethod?: IDeliveryMethod;
}
/** @category Types */
export interface IDeliveryMethod extends IThing {
}
/** @category Types */
export interface IContactPoint extends IThing {
    areaServed?: Array<IPlace>;
    contactType?: string;
    email?: string;
    faxNumber?: string;
    hoursAvailable?: IThing;
    productsSupported?: Array<IProduct>;
    telephone?: string;
}
/** @category Types */
export interface IPostalAddress extends IContactPoint {
    addressCountry?: string;
    addressLocality?: string;
    addressRegion?: string;
    postOfficeBoxNumber?: string;
    postalCode?: string;
    streetAddress?: string;
}
/** @category Types */
export interface IGeoCoordinates extends IThing {
    address?: IPostalAddress;
    elevation?: string;
    latitude?: string;
    longitude?: string;
}
/** @category Types */
export interface IPlace extends IThing {
    additionalProperty?: Array<IThing>;
    address?: IPostalAddress;
    branchCode?: string;
    containedInPlace?: IPlace;
    containsPlace?: Array<IPlace>;
    event?: Array<IEvent>;
    faxNumber?: string;
    telephone?: string;
    geo?: IGeoCoordinates;
    geoContains?: Array<IPlace>;
    geoCoveredBy?: Array<IPlace>;
    geoCovers?: Array<IPlace>;
    geoCrosses?: Array<IPlace>;
    geoDisjoint?: Array<IPlace>;
    geoEquals?: Array<IPlace>;
    geoIntersects?: Array<IPlace>;
    geoOverlaps?: Array<IPlace>;
    geoTouces?: Array<IPlace>;
    geoWithin?: Array<IPlace>;
    globalLocationNumber?: string;
    hasDriveThroughService?: boolean;
    hasMap?: IThing;
    isAccessibleForFree?: boolean;
    keywords?: Array<string>;
    latitude?: string;
    longitude?: string;
    logo?: IMediaObject;
    photo?: IMediaObject;
    publicAccess?: boolean;
    slogan?: string;
    smokingAllowed?: boolean;
    tourBookingPage?: IThing;
}
/** @category Types */
export interface IAccommodation extends IPlace {
    accommodationFloorPlan?: IThing;
    tourBookingPage?: IThing;
    numberOfBedrooms?: number;
}
/** @category Types */
export interface IApartmentComplex extends IAccommodation {
    numberOfAccommodationUnits?: number;
    numberOfAvailableAccommodationUnits?: number;
    petsAllowed?: boolean;
}
/** @category Types */
export interface IGatedResidenceCommunity extends IAccommodation {
}
/** @category Types */
export interface IAdministrativeArea extends IPlace {
}
/** @category Types */
export interface ICivicStructure extends IPlace {
}
/** @category Types */
export interface IAirport extends ICivicStructure {
}
/** @category Types */
export interface IAquarium extends ICivicStructure {
}
/** @category Types */
export interface IBeach extends ICivicStructure {
}
/** @category Types */
export interface IBoatTerminal extends ICivicStructure {
}
/** @category Types */
export interface IBridge extends ICivicStructure {
}
/** @category Types */
export interface IBusStation extends ICivicStructure {
}
/** @category Types */
export interface IBusStop extends ICivicStructure {
}
/** @category Types */
export interface ICampground extends ICivicStructure {
}
/** @category Types */
export interface ICemetery extends ICivicStructure {
}
/** @category Types */
export interface ICrematorium extends ICivicStructure {
}
/** @category Types */
export interface IEventVenue extends ICivicStructure {
}
/** @category Types */
export interface IFireStation extends ICivicStructure {
}
/** @category Types */
export interface IGovernmentBuilding extends ICivicStructure {
}
/** @category Types */
export interface IHospital extends ICivicStructure {
}
/** @category Types */
export interface IMovieTheater extends ICivicStructure {
}
/** @category Types */
export interface IMuseum extends ICivicStructure {
}
/** @category Types */
export interface IMusicVenue extends ICivicStructure {
}
/** @category Types */
export interface IPark extends ICivicStructure {
}
/** @category Types */
export interface IParkingFacility extends ICivicStructure {
}
/** @category Types */
export interface IPerformingArtsTheater extends ICivicStructure {
}
/** @category Types */
export interface IPlaceOfWorship extends ICivicStructure {
}
/** @category Types */
export interface IPlayground extends ICivicStructure {
}
/** @category Types */
export interface IPoliceStation extends ICivicStructure {
}
/** @category Types */
export interface IPublicToilet extends ICivicStructure {
}
/** @category Types */
export interface IRVPark extends ICivicStructure {
}
/** @category Types */
export interface IStadiumOrArena extends ICivicStructure {
}
/** @category Types */
export interface ISubwayStation extends ICivicStructure {
}
/** @category Types */
export interface ITaxiStand extends ICivicStructure {
}
/** @category Types */
export interface ITrainStation extends ICivicStructure {
}
/** @category Types */
export interface IZoo extends ICivicStructure {
}
/** @category Types */
export interface ICityHall extends IGovernmentBuilding {
}
/** @category Types */
export interface ICourthouse extends IGovernmentBuilding {
}
/** @category Types */
export interface IDefenceEstablishment extends IGovernmentBuilding {
}
/** @category Types */
export interface IEmbassy extends IGovernmentBuilding {
}
/** @category Types */
export interface ILegislativeBuilding extends IGovernmentBuilding {
}
/** @category Types */
export interface IBuddhistTemple extends IPlaceOfWorship {
}
/** @category Types */
export interface IChurch extends IPlaceOfWorship {
}
/** @category Types */
export interface IHinduTemple extends IPlaceOfWorship {
}
/** @category Types */
export interface IMosque extends IPlaceOfWorship {
}
/** @category Types */
export interface ISynagogue extends IPlaceOfWorship {
}
/** @category Types */
export interface ILandform extends IPlace {
}
/** @category Types */
export interface IBodyOfWater extends ILandform {
}
/** @category Types */
export interface IContinent extends ILandform {
}
/** @category Types */
export interface IMountain extends ILandform {
}
/** @category Types */
export interface IVolcano extends ILandform {
}
/** @category Types */
export interface ILandmarksOrHistoricalBuildings extends IPlace {
}
/** @category Types */
export interface IResidence extends IPlace {
}
/** @category Types */
export interface ITouristAttraction extends IPlace {
}
/** @category Types */
export interface ITouristDestination extends IPlace {
}
/** @category Types */
export interface IMonetaryAmount extends IThing {
    currency?: string;
    duration?: string;
    minValue?: number;
    maxValue?: number;
    median?: number;
    percentile10?: number;
    percentile25?: number;
    percentile75?: number;
    percentile90?: number;
    validFrom?: Date;
    validTo?: Date;
    value?: string;
}
/** @category Types */
export interface IOccupation extends IThing {
    educationRequirements?: IThing;
    estimatedSalary?: Array<IMonetaryAmount>;
    experienceRequirements?: Array<IThing>;
    occupationLocation?: Array<IPlace>;
    occupationalCategory?: Array<IThing>;
    qualifications?: Array<IThing>;
    responsibilities?: Array<IThing>;
    skills?: Array<IThing>;
}
/** @category Types */
export interface IContactBase extends IThing {
    address?: IPostalAddress;
    brand?: IBrand;
    email?: string;
    event?: Array<IEvent>;
    hasOfferCatalog?: Array<IOfferCatalog>;
    makesOffer?: Array<IOffer>;
    memberOf?: Array<IOrganization>;
    seeks?: Array<IProduct>;
    telephone?: string;
    taxID?: string;
    vatID?: string;
}
/** @category Types */
export interface IPerson extends IContactBase {
    affiliation?: Array<IOrganization>;
    alumniOf?: Array<IOrganization>;
    award?: Array<IThing>;
    birthDate?: Date;
    birthPlace?: IPlace;
    callSign?: Array<string>;
    childern?: Array<IPerson>;
    colleague?: Array<IPerson>;
    familyName?: string;
    follows?: Array<IPerson>;
    gender?: string;
    givenName?: string;
    hasOccupation?: Array<IOccupation>;
    height?: string;
    weight?: string;
    homeLocation?: IPlace;
    honorificPrefix?: string;
    honorificSuffix?: string;
    jobTitle?: string;
    knows?: Array<IPerson>;
    knowsAbout?: Array<IThing>;
    knowsLanguage?: Array<string>;
    owns?: Array<IProduct>;
    relatedTo?: Array<IPerson>;
    sibling?: Array<IPerson>;
    spouse?: Array<IPerson>;
    sponsor?: Array<IOrganization>;
    workLocation?: IPlace;
    worksFor?: Array<IOrganization>;
}
/** @category Types */
export interface IOrganization extends IContactBase {
    areaServed?: Array<IPlace>;
    contactPoint?: Array<IContactPoint>;
    department?: Array<IOrganization>;
    dissolutionDate?: Date;
    duns?: string;
    employee?: Array<IPerson>;
    founder?: Array<IPerson>;
    foundingDate?: Date;
    foundingLocation?: IPlace;
    funder?: Array<IOrganization>;
    member?: Array<IPerson>;
    location?: Array<IPlace>;
    numberOfEmployees?: Array<number>;
    parentOrganization?: IOrganization;
    subOrganization?: Array<IOrganization>;
}
/** @category Types */
export interface IAirline extends IOrganization {
}
/** @category Types */
export interface IConsortium extends IOrganization {
}
/** @category Types */
export interface ICorporation extends IOrganization {
}
/** @category Types */
export interface IEducationalOrganization extends IOrganization {
}
/** @category Types */
export interface IGovernmentOrganization extends IOrganization {
}
/** @category Types */
export interface ILibrarySystem extends IOrganization {
}
/** @category Types */
export interface ILocalBusiness extends IOrganization {
}
/** @category Types */
export interface IMedicalOrganization extends IOrganization {
}
/** @category Types */
export interface INGO extends IOrganization {
}
/** @category Types */
export interface INewsMediaOrganization extends IOrganization {
}
/** @category Types */
export interface IOnlineBusiness extends IOrganization {
}
/** @category Types */
export interface IPerformingGroup extends IOrganization {
}
/** @category Types */
export interface IProject extends IOrganization {
}
/** @category Types */
export interface IResearchOrganization extends IOrganization {
}
/** @category Types */
export interface ISearchRescueOrganization extends IOrganization {
}
/** @category Types */
export interface ISportsOrganization extends IOrganization {
}
/** @category Types */
export interface IWorkersUnion extends IOrganization {
}
/** @category Types */
export interface ICollegeOrUniversity extends IEducationalOrganization {
}
/** @category Types */
export interface IElementarySchool extends IEducationalOrganization {
}
/** @category Types */
export interface IHighSchool extends IEducationalOrganization {
}
/** @category Types */
export interface IMiddleSchool extends IEducationalOrganization {
}
/** @category Types */
export interface IPreschool extends IEducationalOrganization {
}
/** @category Types */
export interface ISchool extends IEducationalOrganization {
}
/** @category Types */
export interface IAnimalShelter extends ILocalBusiness {
}
/** @category Types */
export interface IArchiveOrganization extends ILocalBusiness {
}
/** @category Types */
export interface IAutomotiveBusiness extends ILocalBusiness {
}
/** @category Types */
export interface IChildCare extends ILocalBusiness {
}
/** @category Types */
export interface IDentist extends ILocalBusiness {
}
/** @category Types */
export interface IDryCleaningOrLaundry extends ILocalBusiness {
}
/** @category Types */
export interface IEmergencyService extends ILocalBusiness {
}
/** @category Types */
export interface IEmploymentAgency extends ILocalBusiness {
}
/** @category Types */
export interface IEntertainmentBusiness extends ILocalBusiness {
}
/** @category Types */
export interface IFinancialService extends ILocalBusiness {
}
/** @category Types */
export interface IFoodEstablishment extends ILocalBusiness {
}
/** @category Types */
export interface IGovernmentOffice extends ILocalBusiness {
}
/** @category Types */
export interface IHealthAndBeautyBusiness extends ILocalBusiness {
}
/** @category Types */
export interface IHomeAndConstructionBusiness extends ILocalBusiness {
}
/** @category Types */
export interface IInternetCafe extends ILocalBusiness {
}
/** @category Types */
export interface ILegalService extends ILocalBusiness {
}
/** @category Types */
export interface ILibrary extends ILocalBusiness {
}
/** @category Types */
export interface ILodgingBusiness extends ILocalBusiness {
}
/** @category Types */
export interface IMedicalBusiness extends ILocalBusiness {
}
/** @category Types */
export interface IProfessionalService extends ILocalBusiness {
}
/** @category Types */
export interface IRadioStation extends ILocalBusiness {
}
/** @category Types */
export interface IRealEstateAgent extends ILocalBusiness {
}
/** @category Types */
export interface IRecyclingCenter extends ILocalBusiness {
}
/** @category Types */
export interface ISelfStorage extends ILocalBusiness {
}
/** @category Types */
export interface IShoppingCenter extends ILocalBusiness {
}
/** @category Types */
export interface ISportsActivityLocation extends ILocalBusiness {
}
/** @category Types */
export interface IStore extends ILocalBusiness {
}
/** @category Types */
export interface ITelevisionStation extends ILocalBusiness {
}
/** @category Types */
export interface ITouristInformationCenter extends ILocalBusiness {
}
/** @category Types */
export interface ITravelAgency extends ILocalBusiness {
}
/** @category Types */
export interface ISportsTeam extends ISportsOrganization {
}
/** @category Types */
export interface IResearchProject extends IProject {
}
/** @category Types */
export interface IOnlineStore extends IOnlineBusiness {
}
/** @category Types */
export interface ICreativeWork extends IThing {
    about?: IThing;
    abstract?: string;
    accessMode?: string;
    accessibilitySummary?: string;
    alternativeHeadline?: string;
    archivedAt?: Array<IThing>;
    associatedMedia?: Array<IMediaObject>;
    audience?: Array<IThing>;
    audio?: Array<IThing>;
    author?: Array<IPerson | IOrganization>;
    award?: Array<string>;
    character?: Array<IPerson>;
    citation?: Array<ICreativeWork>;
    comment?: Array<string>;
    commentCount?: number;
    conditionsOfAccess?: string;
    contentLocation?: IPlace;
    contentRating?: IThing;
    contentReferenceTime?: Date;
    contributor?: Array<IPerson | IOrganization>;
    copyrightHolder?: Array<IPerson | IOrganization>;
    copyrightNotice?: string;
    copyrightYear?: number;
    correction?: Array<IThing>;
    countryOfOrigin?: string;
    creativeWorkStatus?: string;
    creator?: Array<IPerson | IOrganization>;
    creditText?: string;
    dateCreated?: Date;
    dateModified?: Date;
    datePublished?: Date;
    discussionUrl?: IThing;
    editor?: Array<IPerson>;
    educationalAlignment?: IThing;
    educationalLevel?: IThing;
    educationalUse?: IThing;
    expires?: Date;
    funder?: Array<IPerson | IOrganization>;
    funding?: Array<IThing>;
    genre?: Array<IThing>;
    hasPart?: Array<ICreativeWork>;
    headline?: string;
    inLanguage?: Array<string>;
    isAccessibleForFree?: boolean;
    isBasedOn?: Array<IProduct | ICreativeWork>;
    isFamilyFriendly?: boolean;
    isPartOf?: Array<ICreativeWork>;
    keyword?: Array<string>;
    learningResourceType?: Array<string>;
    license?: Array<ICreativeWork>;
    locationCreated?: IPlace;
    mainEntity?: IThing;
    maintainer?: Array<IPerson | IOrganization>;
    material?: Array<IThing>;
    offers?: Array<IOffer>;
    pattern?: IThing;
    position?: number;
    producer?: Array<IPerson | IOrganization>;
    provider?: Array<IPerson | IOrganization>;
    publication?: Array<IThing>;
    publisher?: Array<IPerson | IOrganization>;
    publisherImprint?: IOrganization;
    recordedAt?: IEvent;
    releasedEvent?: Array<IThing>;
    review?: Array<IThing>;
    schemaVersion?: IThing;
    size?: IThing;
    sourceOrganization?: IOrganization;
    sponsor?: Array<IPerson | IOrganization>;
    thumbnailUrl?: IMediaObject;
    translator?: Array<IPerson | IOrganization>;
    typicalAgeRange?: string;
    usageInfo?: IThing;
    version?: string;
    video?: Array<IThing>;
    workExample?: Array<ICreativeWork>;
    workTranslation?: Array<ICreativeWork>;
}
/** @category Types */
export interface IArchiveComponent extends ICreativeWork {
}
/** @category Types */
export interface IArticle extends ICreativeWork {
}
/** @category Types */
export interface IAtlas extends ICreativeWork {
}
/** @category Types */
export interface IBlog extends ICreativeWork {
}
/** @category Types */
export interface IBook extends ICreativeWork {
}
/** @category Types */
export interface IChapter extends ICreativeWork {
}
/** @category Types */
export interface IClaim extends ICreativeWork {
}
/** @category Types */
export interface IClip extends ICreativeWork {
}
/** @category Types */
export interface IComicStory extends ICreativeWork {
}
/** @category Types */
export interface IComment extends ICreativeWork {
}
/** @category Types */
export interface IConversation extends ICreativeWork {
}
/** @category Types */
export interface ICourse extends ICreativeWork {
}
/** @category Types */
export interface ICreativeWorkSeason extends ICreativeWork {
}
/** @category Types */
export interface ICreativeWorkSeries extends ICreativeWork {
}
/** @category Types */
export interface IDataCatalog extends ICreativeWork {
}
/** @category Types */
export interface IDataset extends ICreativeWork {
}
/** @category Types */
export interface IDiet extends ICreativeWork {
}
/** @category Types */
export interface IDigitalDocument extends ICreativeWork {
}
/** @category Types */
export interface IDrawing extends ICreativeWork {
}
/** @category Types */
export interface IEpisode extends ICreativeWork {
}
/** @category Types */
export interface IExercisePlan extends ICreativeWork {
}
/** @category Types */
export interface IGame extends ICreativeWork {
}
/** @category Types */
export interface IGuide extends ICreativeWork {
}
/** @category Types */
export interface IHowTo extends ICreativeWork {
}
/** @category Types */
export interface IHowToDirection extends ICreativeWork {
}
/** @category Types */
export interface IHowToSection extends ICreativeWork {
}
/** @category Types */
export interface IHowToStep extends ICreativeWork {
}
/** @category Types */
export interface IHowToTip extends ICreativeWork {
}
/** @category Types */
export interface IHyperToc extends ICreativeWork {
}
/** @category Types */
export interface IHyperTocEntry extends ICreativeWork {
}
/** @category Types */
export interface ILearningResource extends ICreativeWork {
}
/** @category Types */
export interface ILegislation extends ICreativeWork {
}
/** @category Types */
export interface IManuscript extends ICreativeWork {
}
/** @category Types */
export interface IMap extends ICreativeWork {
}
/** @category Types */
export interface IMathSolver extends ICreativeWork {
}
/** @category Types */
export interface IMediaReviewItem extends ICreativeWork {
}
/** @category Types */
export interface IMenu extends ICreativeWork {
}
/** @category Types */
export interface IMenuSection extends ICreativeWork {
}
/** @category Types */
export interface IMessage extends ICreativeWork {
}
/** @category Types */
export interface IMovie extends ICreativeWork {
}
/** @category Types */
export interface IMusicComposition extends ICreativeWork {
}
/** @category Types */
export interface IMusicPlaylist extends ICreativeWork {
}
/** @category Types */
export interface IMusicRecording extends ICreativeWork {
}
/** @category Types */
export interface IPainting extends ICreativeWork {
}
/** @category Types */
export interface IPhotograph extends ICreativeWork {
}
/** @category Types */
export interface IPlay extends ICreativeWork {
}
/** @category Types */
export interface IPoster extends ICreativeWork {
}
/** @category Types */
export interface IPublicationIssue extends ICreativeWork {
}
/** @category Types */
export interface IPublicationVolume extends ICreativeWork {
}
/** @category Types */
export interface IQuotation extends ICreativeWork {
}
/** @category Types */
export interface IReview extends ICreativeWork {
}
/** @category Types */
export interface ISculpture extends ICreativeWork {
}
/** @category Types */
export interface ISheetMusic extends ICreativeWork {
}
/** @category Types */
export interface IShortStory extends ICreativeWork {
}
/** @category Types */
export interface ISoftwareApplication extends ICreativeWork {
}
/** @category Types */
export interface ISoftwareSourceCode extends ICreativeWork {
}
/** @category Types */
export interface ISpecialAnnouncement extends ICreativeWork {
}
/** @category Types */
export interface IStatement extends ICreativeWork {
}
/** @category Types */
export interface ITVSeason extends ICreativeWork {
}
/** @category Types */
export interface ITVSeries extends ICreativeWork {
}
/** @category Types */
export interface IThesis extends ICreativeWork {
}
/** @category Types */
export interface IVisualArtwork extends ICreativeWork {
}
/** @category Types */
export interface IWebContent extends ICreativeWork {
}
/** @category Types */
export interface IWebPage extends ICreativeWork {
}
/** @category Types */
export interface IWebPageElement extends ICreativeWork {
}
/** @category Types */
export interface IWebSite extends ICreativeWork {
}
/** @category Types */
export interface IConcept extends IThing {
    broader?: IConcept;
    narrower?: Array<IConcept>;
    related?: Array<IConcept>;
    note?: string;
    definition?: string;
    example?: IThing;
    prefLabel?: string;
    altLabel?: Array<string>;
}
/** @category Types */
export interface IConceptScheme extends IThing {
    hasTopConcept?: Array<IConcept>;
}
/** @category Types */
export interface ICollection extends ICreativeWork {
    member?: Array<IConcept>;
    total?: number;
    filters?: Array<IThing>;
}
/** @category Types */
export interface IOrderedCollection extends IThing {
    memberList?: Array<IConcept>;
    total?: number;
    limit?: number;
    page?: number;
    pages?: number;
    from?: number;
    to?: number;
    sort?: string;
    filters?: Array<IThing>;
}
/** @category Types */
export interface IResume extends IObject {
    uuid?: string;
    basics?: Array<IResumeBasics>;
    work?: Array<IResumeWork>;
    volunteer?: Array<IResumeVolunteer>;
    education?: Array<IResumeEducation>;
    awards?: Array<IResumeAward>;
    certificates?: Array<IResumeCertificate>;
    publications?: Array<IResumePublication>;
    skills?: Array<IResumeSkill>;
    languages?: Array<IResumeLanguage>;
    interests?: Array<IResumeInterest>;
    references?: Array<IResumeReference>;
    projects?: Array<IResumeProject>;
}
/** @category Types */
export interface IResumeBasics extends IObject {
    uuid?: string;
    name?: string;
    label?: string;
    image?: IMediaObject;
    email?: string;
    phone?: string;
    url?: string;
    summary?: string;
    location?: IResumeLocation;
    profiles?: Array<IResumeProfile>;
}
/** @category Types */
export interface IResumeLocation extends IObject {
    uuid?: string;
    address?: string;
    postalCode?: string;
    city?: string;
    countryCode?: string;
    region?: string;
}
/** @category Types */
export interface IResumeProfile extends IObject {
    uuid?: string;
    network?: string;
    username?: string;
    url?: string;
}
/** @category Types */
export interface IResumeWork extends IObject {
    uuid?: string;
    name?: string;
    position?: string;
    url?: string;
    startDate?: Date;
    endDate?: Date;
    summary?: Date;
    highlights?: Array<string>;
}
/** @category Types */
export interface IResumeVolunteer extends IObject {
    uuid?: string;
    organization?: string;
    position?: string;
    url?: string;
    startDate?: Date;
    endDate?: Date;
    summary?: string;
    highlights?: Array<string>;
}
/** @category Types */
export interface IResumeEducation extends IObject {
    uuid?: string;
    institution?: string;
    url?: string;
    area?: string;
    studyType?: string;
    startDate?: Date;
    endDate?: Date;
    score?: string;
    courses?: Array<string>;
}
/** @category Types */
export interface IResumeAward extends IObject {
    uuid?: string;
    title?: string;
    date?: Date;
    awarder?: string;
    summary?: string;
}
/** @category Types */
export interface IResumeCertificate extends IObject {
    uuid?: string;
    name?: string;
    date?: Date;
    issuer?: string;
    url?: string;
}
/** @category Types */
export interface IResumePublication extends IObject {
    uuid?: string;
    name?: string;
    publisher?: string;
    releaseDate?: Date;
    url?: string;
    summmary?: string;
}
/** @category Types */
export interface IResumeSkill extends IObject {
    uuid?: string;
    name?: string;
    level?: string;
    keywords?: Array<string>;
}
/** @category Types */
export interface IResumeLanguage extends IObject {
    uuid?: string;
    language?: string;
    fluency?: string;
}
/** @category Types */
export interface IResumeInterest extends IObject {
    uuid?: string;
    name?: string;
    keywords?: string;
}
/** @category Types */
export interface IResumeReference extends IObject {
    uuid?: string;
    name?: string;
    reference?: string;
    email?: string;
    phone?: string;
}
/** @category Types */
export interface IResumeProject extends IObject {
    uuid?: string;
    name?: string;
    startDate?: Date;
    endDate?: Date;
    summary?: Date;
    highlights?: Array<string>;
    url?: string;
}
/** @category Types */
export interface IJobPosting extends IThing {
    uuid?: string;
    applicantLocationRequirements?: IPlace;
    applicationContact?: IContactPoint;
    baseSalary?: IMonetaryAmount;
    datePosted?: Date;
    directApply?: boolean;
    educationalRequirements?: Array<IEducationalOccupationalCredential>;
    eligibilityToWorkRequirement?: string;
    employerOverview?: string;
    employmentType?: string;
    employmentUnit?: IOrganization;
    estimatedSalary?: IMonetaryAmount;
    experienceInPlaceOfEducation?: boolean;
    experienceRequirements?: Array<IOccupationalExperienceRequirements>;
    hiringOrganization?: IPerson | IOrganization;
    incentiveCompensation?: string;
    industry?: IDefinedTerm;
    jobBenefits?: string;
    jobImmediateStart?: boolean;
    jobLocation?: IPlace;
    jobLocationType?: string;
    jobStartDate?: Date;
    occupationalCategory?: IThing;
    physicalRequirement?: IThing;
    qualifications?: IEducationalOccupationalCredential;
    relevantOccupation?: IOccupation;
    responsibilities?: string;
    salaryCurrency?: string;
    securityClearanceRequirement?: IThing;
    sensoryRequirement?: IThing;
    skills?: Array<string>;
    specialCommitments?: string;
    title?: string;
    totalJobOpenings?: number;
    validThrough?: Date;
    workHours?: string;
}
/** @category Types */
export interface IEducationalOccupationalCredential extends ICreativeWork {
    competencyRequired?: IThing;
    credentialCategory?: IThing;
    educationalLevel?: IThing;
    recognizedBy?: IOrganization;
    validFor?: string;
    validIn?: IPlace;
}
/** @category Types */
export interface IOccupationalExperienceRequirements extends IThing {
    monthsOfExperience?: number;
}
//# sourceMappingURL=index.d.ts.map