import axios from 'axios';

export function search(query) {
	return new Promise((resolve, reject) => {
		axios
			.get(
				'/search-events?text=' +
					query.text +
					'&start_date=' +
					query.start_date +
					'&end_date=' +
					query.end_date +
					'&country_code=' +
					query.country_code +
					'&administrative_area=' +
					query.administrative_area +
					'&locality=' +
					query.locality +
					'&postal_code=' +
					query.postal_code +
					'&thoroughfare=' +
					query.thoroughfare +
					'&event_types=' +
					query.event_types +
					'&series=' +
					query.series +
					'&ticketed=' +
					query.ticketed +
					'&private=' +
					query.private
			)
			.then(res => {
				resolve(res);
			})
			.catch(err => {
				reject(err);
			});
	});
}
