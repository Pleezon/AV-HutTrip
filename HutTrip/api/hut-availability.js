export default async function handler(req, res) {
    const {hutId} = req.query;
    try {
        const response = await fetch(`https://www.hut-reservation.org/api/v1/reservation/getHutAvailability?hutId=${hutId}`);
        const data = await response.json();

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(data);
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch data'});
    }
}