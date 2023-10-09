for i in [
    'Airline',
    'Consortium',
    'Corporation',
    'EducationalOrganization',
    'GovernmentOrganization',
    'LibrarySystem',
    'LocalBusiness',
    'MedicalOrganization',
    'NGO',
    'NewsMediaOrganization',
    'OnlineBusiness',
    'PerformingGroup',
    'Project',
    'ResearchOrganization',
    'SearchRescueOrganization',
    'SportsOrganization',
    'WorkersUnion',
]:
    print("typeData.push(['I" + i + "', SCH('" + i + "'), 'IOrganization'])")
    print("propData['I" + i + "'] = {}")
    print()

for i in [
    'CollegeOrUniversity',
    'ElementarySchool',
    'HighSchool',
    'MiddleSchool',
    'Preschool',
    'School',
]:
    print("typeData.push(['I" + i + "', SCH('" + i + "'), 'IEducationalOrganization'])")
    print("propData['I" + i + "'] = {}")
    print()

for i in [
    'AnimalShelter',
    'ArchiveOrganization',
    'AutomotiveBusiness',
    'ChildCare',
    'Dentist',
    'DryCleaningOrLaundry',
    'EmergencyService',
    'EmploymentAgency',
    'EntertainmentBusiness',
    'FinancialService',
    'FoodEstablishment',
    'GovernmentOffice',
    'HealthAndBeautyBusiness',
    'HomeAndConstructionBusiness',
    'InternetCafe',
    'LegalService',
    'Library',
    'LodgingBusiness',
    'MedicalBusiness',
    'ProfessionalService',
    'RadioStation',
    'RealEstateAgent',
    'RecyclingCenter',
    'SelfStorage',
    'ShoppingCenter',
    'SportsActivityLocation',
    'Store',
    'TelevisionStation',
    'TouristInformationCenter',
    'TravelAgency',
]:
    print("typeData.push(['I" + i + "', SCH('" + i + "'), 'ILocalBusiness'])")
    print("propData['I" + i + "'] = {}")
    print()

for i in [
    'SportsTeam'
]:
    print("typeData.push(['I" + i + "', SCH('" + i + "'), 'ISportsOrganization'])")
    print("propData['I" + i + "'] = {}")
    print()

for i in [
    'ResearchProject'
]:
    print("typeData.push(['I" + i + "', SCH('" + i + "'), 'IProject'])")
    print("propData['I" + i + "'] = {}")
    print()

for i in [
    'OnlineStore'
]:
    print("typeData.push(['I" + i + "', SCH('" + i + "'), 'IOnlineBusiness'])")
    print("propData['I" + i + "'] = {}")
    print()

