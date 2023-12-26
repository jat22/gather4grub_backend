"use strict";

/**
 * Sort events chronologically, past ==> future
 * @param {Array} events 
 * @returns {Array} events - array of event objects
 */
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

/**
 * Takes an array of ordered Events and seperates them into past and upcoming.
 * @param {Array} orderedEvents - array of event objects
 * @returns {Object} sortedEvents
 */
const sortPastUpcoming = (orderedEvents) => {
	if(!orderedEvents) return null

	const upcoming = [];
	const past = [];
	const now = new Date();

	for(let i = 0; i < orderedEvents.length; i++) {
		const e = orderedEvents[i]
		const date = new Date(e.date)
		
		if(date < now) past.push(e);
		if(date > now) {
			upcoming.push(...orderedEvents.slice(i, orderedEvents.length))
			break
		}
	}
	return {past: past, upcoming: upcoming}
}

/**
 * sorts dishes into appropriate course and returns array
 * @param {Array} courses 
 * @param {Array} dishes 
 * @returns {Array} menu - course objects with item arrays.
 */
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