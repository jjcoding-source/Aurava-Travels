import asyncHandler from 'express-async-handler'
import Tour from '../models/Tour.model.js'

export const getAllTours = asyncHandler(async (req, res) => {
  const {
    destination,
    category,
    minPrice,
    maxPrice,
    duration,
    minRating,
    sort,
    page = 1,
    limit = 9,
  } = req.query

  const filter = { isActive: true }

  if (destination) {
    filter.$or = [
      { title: { $regex: destination, $options: 'i' } },
      { countries: { $elemMatch: { $regex: destination, $options: 'i' } } },
    ]
  }

  if (category) filter.category = category

  if (minPrice || maxPrice) {
    filter.price = {}
    if (minPrice) filter.price.$gte = Number(minPrice)
    if (maxPrice) filter.price.$lte = Number(maxPrice)
  }

  if (duration) {
    const dur = Number(duration)
    if (dur === 5) filter.duration = { $lte: 5 }
    else if (dur === 8) filter.duration = { $gte: 6, $lte: 8 }
    else if (dur === 12) filter.duration = { $gte: 9, $lte: 12 }
    else if (dur === 99) filter.duration = { $gte: 13 }
  }

  if (minRating) filter.rating = { $gte: Number(minRating) }

  let sortObj = {}
  switch (sort) {
    case 'price_asc':
      sortObj = { price: 1 }
      break
    case 'price_desc':
      sortObj = { price: -1 }
      break
    case 'duration_asc':
      sortObj = { duration: 1 }
      break
    case 'rating':
      sortObj = { rating: -1 }
      break
    default:
      sortObj = { reviewCount: -1 }
  }

  // Pagination 
  const pageNum = Number(page)
  const limitNum = Number(limit)
  const skip = (pageNum - 1) * limitNum

  const total = await Tour.countDocuments(filter)
  const tours = await Tour.find(filter)
    .sort(sortObj)
    .skip(skip)
    .limit(limitNum)

  res.json({
    success: true,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    tours,
  })
})


export const getFeaturedTours = asyncHandler(async (req, res) => {
  const tours = await Tour.find({ isFeatured: true, isActive: true })
    .sort({ rating: -1 })
    .limit(6)

  res.json({
    success: true,
    tours,
  })
})

export const getTourById = asyncHandler(async (req, res) => {
  const tour = await Tour.findById(req.params.id)

  if (!tour || !tour.isActive) {
    res.status(404)
    throw new Error('Tour not found')
  }

  res.json({
    success: true,
    tour,
  })
})

export const createTour = asyncHandler(async (req, res) => {
  const tour = await Tour.create(req.body)

  res.status(201).json({
    success: true,
    tour,
  })
})

export const updateTour = asyncHandler(async (req, res) => {
  const tour = await Tour.findById(req.params.id)

  if (!tour) {
    res.status(404)
    throw new Error('Tour not found')
  }

  const updatedTour = await Tour.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  )

  res.json({
    success: true,
    tour: updatedTour,
  })
})

export const deleteTour = asyncHandler(async (req, res) => {
  const tour = await Tour.findById(req.params.id)

  if (!tour) {
    res.status(404)
    throw new Error('Tour not found')
  }

  // Soft delete — set isActive to false
  tour.isActive = false
  await tour.save()

  res.json({
    success: true,
    message: 'Tour deleted successfully',
  })
})

export const seedTours = asyncHandler(async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.status(403)
    throw new Error('Seeding not allowed in production')
  }

  await Tour.deleteMany({})

  const tours = await Tour.insertMany([
    {
      title: 'Europe Grand Tour',
      overview: 'Experience the best of Europe on this carefully curated 10-day grand tour covering France, Switzerland and Italy.',
      countries: ['France', 'Switzerland', 'Italy'],
      duration: 10,
      price: 250000,
      totalSeats: 40,
      seatsAvailable: 12,
      category: 'europe',
      highlights: [
        'Guided tour of the Louvre Museum in Paris',
        'Eiffel Tower visit with optional Seine River cruise',
        'Mount Titlis snow experience',
        'Colosseum and Vatican City in Rome',
        'Gondola ride through Venice canals',
      ],
      itinerary: [
        { day: 1, title: 'Arrival in Paris', description: 'Arrive at Charles de Gaulle Airport. Welcome dinner at a French brasserie.', activities: ['Airport transfer', 'Hotel check-in', 'Welcome dinner'] },
        { day: 2, title: 'Eiffel Tower & Louvre', description: 'Morning guided tour of the Louvre. Afternoon visit to the Eiffel Tower.', activities: ['Louvre Museum', 'Eiffel Tower', 'Seine cruise'] },
        { day: 3, title: 'Paris to Geneva', description: 'Scenic train to Geneva. Explore old town and Jet d Eau fountain.', activities: ['TGV train', 'Old Town walk', 'Jet d Eau'] },
        { day: 4, title: 'Mount Titlis', description: 'Full day excursion to Mount Titlis. Rotair cable car, Snow World, Cliff Walk.', activities: ['Cable car', 'Snow World', 'Cliff Walk'] },
        { day: 5, title: 'Zurich City Tour', description: 'Explore Bahnhofstrasse and Grossmunster cathedral. Swiss fondue dinner.', activities: ['Bahnhofstrasse', 'Grossmunster', 'Fondue dinner'] },
      ],
      included: [
        { item: 'Return flights from Mumbai', included: true },
        { item: '9 nights 3-star hotels', included: true },
        { item: 'Daily breakfast and dinner', included: true },
        { item: 'AC coach transfers', included: true },
        { item: 'All sightseeing entries', included: true },
        { item: 'Lunch', included: false },
        { item: 'Personal expenses', included: false },
      ],
      departureDates: [
        { date: '15 June 2025', seatsLeft: 12 },
        { date: '20 July 2025', seatsLeft: 28 },
        { date: '10 August 2025', seatsLeft: 40 },
      ],
      badge: 'Selling Fast',
      rating: 4.9,
      reviewCount: 128,
      isFeatured: true,
    },
    {
      title: 'Bali Bliss Escape',
      overview: 'A perfect tropical escape through the most beautiful parts of Bali — rice terraces, temples and beaches.',
      countries: ['Ubud', 'Seminyak', 'Nusa Dua'],
      duration: 7,
      price: 85000,
      totalSeats: 40,
      seatsAvailable: 22,
      category: 'asia',
      highlights: [
        'Sunrise trek at Mount Batur volcano',
        'Traditional Balinese cooking class',
        'Visit to Tanah Lot sea temple',
        'Rice terrace walk in Tegalalang',
      ],
      itinerary: [
        { day: 1, title: 'Arrival in Bali', description: 'Arrive at Ngurah Rai Airport. Transfer to Ubud hotel. Welcome dinner.', activities: ['Airport transfer', 'Hotel check-in', 'Welcome dinner'] },
        { day: 2, title: 'Ubud Exploration', description: 'Visit Tegalalang rice terraces, Monkey Forest and Ubud Palace.', activities: ['Rice terraces', 'Monkey Forest', 'Ubud Palace'] },
        { day: 3, title: 'Mount Batur Sunrise', description: 'Early morning trek to Mount Batur for sunrise views.', activities: ['Volcano trek', 'Sunrise view', 'Hot springs'] },
      ],
      included: [
        { item: 'Return flights from Mumbai', included: true },
        { item: '6 nights hotels', included: true },
        { item: 'Daily breakfast', included: true },
        { item: 'All transfers', included: true },
        { item: 'Visa on arrival fee', included: false },
      ],
      departureDates: [
        { date: '01 July 2025', seatsLeft: 22 },
        { date: '15 August 2025', seatsLeft: 40 },
      ],
      badge: null,
      rating: 4.8,
      reviewCount: 96,
      isFeatured: true,
    },
    {
      title: 'Dubai Luxury Getaway',
      overview: 'Experience the glitz and glamour of Dubai — from the iconic Burj Khalifa to thrilling desert safaris.',
      countries: ['Downtown Dubai', 'Desert Safari', 'Dubai Marina'],
      duration: 5,
      price: 110000,
      totalSeats: 40,
      seatsAvailable: 32,
      category: 'middleeast',
      highlights: [
        'Burj Khalifa observation deck visit',
        'Desert safari with BBQ dinner',
        'Dubai Mall and fountain show',
        'Dhow cruise on Dubai Creek',
      ],
      itinerary: [
        { day: 1, title: 'Arrival in Dubai', description: 'Arrive at Dubai International Airport. Hotel check-in and leisure time.', activities: ['Airport transfer', 'Hotel check-in'] },
        { day: 2, title: 'City Tour', description: 'Burj Khalifa, Dubai Mall, fountain show and Gold Souk.', activities: ['Burj Khalifa', 'Dubai Mall', 'Gold Souk'] },
        { day: 3, title: 'Desert Safari', description: 'Afternoon desert safari with dune bashing, camel ride and BBQ dinner.', activities: ['Dune bashing', 'Camel ride', 'BBQ dinner'] },
      ],
      included: [
        { item: 'Return flights from Mumbai', included: true },
        { item: '4 nights 4-star hotel', included: true },
        { item: 'Daily breakfast', included: true },
        { item: 'Desert safari with dinner', included: true },
        { item: 'Lunch', included: false },
      ],
      departureDates: [
        { date: '10 July 2025', seatsLeft: 32 },
        { date: '20 August 2025', seatsLeft: 40 },
      ],
      badge: 'New',
      rating: 4.7,
      reviewCount: 74,
      isFeatured: true,
    },
    {
      title: 'Swiss Alps Adventure',
      overview: 'Explore the breathtaking Swiss Alps — pristine lakes, snow-capped peaks and charming mountain villages.',
      countries: ['Zurich', 'Interlaken', 'Geneva'],
      duration: 8,
      price: 190000,
      totalSeats: 40,
      seatsAvailable: 8,
      category: 'europe',
      highlights: [
        'Jungfraujoch — Top of Europe visit',
        'Paragliding over Interlaken',
        'Lake Geneva sunset cruise',
        'Grindelwald glacier hike',
      ],
      itinerary: [
        { day: 1, title: 'Arrival in Zurich', description: 'Arrive in Zurich. City tour and lake promenade walk.', activities: ['Airport transfer', 'City tour', 'Lake walk'] },
        { day: 2, title: 'Interlaken', description: 'Travel to Interlaken. Optional paragliding and lake activities.', activities: ['Train to Interlaken', 'Paragliding', 'Lake activities'] },
        { day: 3, title: 'Jungfraujoch', description: 'Full day excursion to Jungfraujoch — Top of Europe at 3454m.', activities: ['Train to Jungfraujoch', 'Snow activities', 'Sphinx Observatory'] },
      ],
      included: [
        { item: 'Return flights from Mumbai', included: true },
        { item: '7 nights hotels', included: true },
        { item: 'Breakfast and dinner', included: true },
        { item: 'Swiss Travel Pass', included: true },
        { item: 'Paragliding', included: false },
      ],
      departureDates: [
        { date: '05 July 2025', seatsLeft: 8 },
        { date: '10 September 2025', seatsLeft: 35 },
      ],
      badge: null,
      rating: 4.9,
      reviewCount: 103,
      isFeatured: true,
    },
    {
      title: 'Japan Cherry Blossom',
      overview: 'Witness the magical sakura season across Japan\'s most iconic cities — Tokyo, Kyoto and Osaka.',
      countries: ['Tokyo', 'Kyoto', 'Osaka'],
      duration: 12,
      price: 220000,
      totalSeats: 35,
      seatsAvailable: 18,
      category: 'asia',
      highlights: [
        'Cherry blossom viewing in Shinjuku Gyoen',
        'Traditional tea ceremony in Kyoto',
        'Fushimi Inari shrine thousand torii gates',
        'Bullet train Shinkansen experience',
        'Nara deer park visit',
      ],
      itinerary: [
        { day: 1, title: 'Arrival in Tokyo', description: 'Arrive at Narita Airport. Transfer to hotel in Shinjuku.', activities: ['Airport transfer', 'Hotel check-in', 'Welcome dinner'] },
        { day: 2, title: 'Tokyo Exploration', description: 'Shinjuku Gyoen cherry blossoms, Senso-ji temple, Akihabara.', activities: ['Shinjuku Gyoen', 'Senso-ji', 'Akihabara'] },
        { day: 3, title: 'Tokyo to Kyoto', description: 'Shinkansen bullet train to Kyoto. Afternoon at Arashiyama bamboo grove.', activities: ['Shinkansen', 'Arashiyama', 'Bamboo grove'] },
      ],
      included: [
        { item: 'Return flights from Mumbai', included: true },
        { item: '11 nights hotels', included: true },
        { item: 'Breakfast daily', included: true },
        { item: 'JR Pass 14 days', included: true },
        { item: 'Japan visa fee', included: false },
      ],
      departureDates: [
        { date: '25 March 2026', seatsLeft: 18 },
        { date: '01 April 2026', seatsLeft: 35 },
      ],
      badge: 'Popular',
      rating: 5.0,
      reviewCount: 61,
      isFeatured: true,
    },
    {
      title: 'Maldives Honeymoon',
      overview: 'The ultimate romantic escape — overwater villas, crystal clear lagoons and pristine white sand beaches.',
      countries: ['North Male Atoll', 'Baa Atoll'],
      duration: 6,
      price: 160000,
      totalSeats: 20,
      seatsAvailable: 10,
      category: 'honeymoon',
      highlights: [
        'Overwater villa with private pool',
        'Snorkelling with manta rays in Baa Atoll',
        'Sunset dolphin cruise',
        'Underwater restaurant dining experience',
        'Couples spa treatment',
      ],
      itinerary: [
        { day: 1, title: 'Arrival in Maldives', description: 'Arrive at Male Airport. Seaplane transfer to resort island.', activities: ['Seaplane transfer', 'Villa check-in', 'Welcome dinner'] },
        { day: 2, title: 'Beach and Lagoon', description: 'Snorkelling, kayaking and beach relaxation. Sunset cruise.', activities: ['Snorkelling', 'Kayaking', 'Sunset cruise'] },
        { day: 3, title: 'Spa and Leisure', description: 'Couples spa treatment. Optional water sports and island hopping.', activities: ['Couples spa', 'Water sports', 'Island hopping'] },
      ],
      included: [
        { item: 'Return flights from Mumbai', included: true },
        { item: 'Seaplane transfers', included: true },
        { item: '5 nights overwater villa', included: true },
        { item: 'All meals included', included: true },
        { item: 'Couples spa', included: true },
      ],
      departureDates: [
        { date: '14 February 2026', seatsLeft: 10 },
        { date: '01 June 2026', seatsLeft: 20 },
      ],
      badge: null,
      rating: 4.8,
      reviewCount: 88,
      isFeatured: true,
    },
  ])

  res.status(201).json({
    success: true,
    message: `${tours.length} tours seeded successfully`,
  })
})