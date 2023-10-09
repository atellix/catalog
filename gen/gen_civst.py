for i in [
    'Airport',
    'Aquarium',
    'Beach',
    'BoatTerminal',
    'Bridge',
    'BusStation',
    'BusStop',
    'Campground',
    'Cemetery',
    'Crematorium',
    'EventVenue',
    'FireStation',
    'GovernmentBuilding',
    'Hospital',
    'MovieTheater',
    'Museum',
    'MusicVenue',
    'Park',
    'ParkingFacility',
    'PerformingArtsTheater',
    'PlaceOfWorship',
    'Playground',
    'PoliceStation',
    'PublicToilet',
    'RVPark',
    'StadiumOrArena',
    'SubwayStation',
    'TaxiStand',
    'TrainStation',
    'Zoo',
]:
    print("typeData.push(['I" + i + "', SCH('" + i + "'), 'ICivicStructure'])")
    print("propData['I" + i + "'] = {}")
    print()

for i in [
    'CityHall',
    'Courthouse',
    'DefenceEstablishment',
    'Embassy',
    'LegislativeBuilding',
]:
    print("typeData.push(['I" + i + "', SCH('" + i + "'), 'IGovernmentBuilding'])")
    print("propData['I" + i + "'] = {}")
    print()

for i in [
    'BuddhistTemple',
    'Church',
    'HinduTemple',
    'Mosque',
    'Synagogue',
]:
    print("typeData.push(['I" + i + "', SCH('" + i + "'), 'IPlaceOfWorship'])")
    print("propData['I" + i + "'] = {}")
    print()

