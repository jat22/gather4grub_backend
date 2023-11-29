"use strict";


const sortEventsByDate = (events) => {
	if(!events || events.length < 1) return null
	const result = events.sort((a,b) => {
		const dateA = new Date(a.date);
		const dateB = new Date(b.date);

		if(dateA < dateB) return -1
		else if(dateA > dateB) return 1
		else return 0
	})

	return result
}

const sortPastUpcoming = (sortedEvents) => {
	if(!sortedEvents) return null

	const upcoming = [];
	const past = [];
	const now = new Date();

	for(let i = 0; i < sortedEvents.length; i++) {
		const e = sortedEvents[i]
		const date = new Date(e.date)
		
		if(date < now) past.push(e);
		if(date > now) {
			upcoming.push(...sortedEvents.slice(i, sortedEvents.length))
			break
		}
	}
	// console.log(`PAST: ${past}`)
	// console.log(`UPCOMING: ${upcoming}`)
	return {past: past, upcoming: upcoming}
}

const buildMenu = (courses, dishes) => {
	const courseMap = {}

	const menu = courses.map( (c, i) => {
		courseMap[c.id] = i
		return { courseName : c.name, courseId : c.id, dishes : []}
	})
	if(dishes || dishes.length > 0){
		dishes.forEach( d => {
			menu[courseMap[d.courseId]].dishes.push(d)
		})
	}
	
	return menu
}


module.exports = {
	sortEventsByDate,
	sortPastUpcoming,
	buildMenu
}