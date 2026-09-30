
export const TripCreator = (args) => {
    const { userlocation, location, duration, budget, interests } = args;

    console.log(userlocation, location, duration, budget, interests);

    if (!userlocation) {
        return {
            success: false,
            tool: "generatePlan",
             args : args,
             missing : ['userlocation'],
            data: null,
            error: {
                code: "",
                message: "can u tell me from which location u are travelling from........",
            },
        };
    } if (!location) {
        return {
            success: false,
            tool: "generatePlan",
             args : args,
             missing : ['location'],
            data: null,
            error: {
                code: "",
                message: "can u tell me from which location u are planning to travel ........",
            },
        };
    }

    return {
        success: true,
        tool: "generatePlan",
        args: {
            userlocation: userlocation,
            location: location,
            duration: duration,
            budget: budget,
            interests: interests ? interests : null
        },
        data: `
Trip Plan for ${location}

Duration: ${duration} days
Budget: ${budget}
Interests: ${interests ? interests : `Not specified`}

Where to Stay:
- Stay near the city center of ${location}
- Choose accommodation close to major attractions and public transportation
- Recommended: Mid-range hotel or hostel

Places to Visit:
- Main landmarks of ${location}
- Historic areas of ${location}
- Popular local markets in ${location}
- Famous cultural attractions in ${location}
- Scenic viewpoints around ${location}
- Popular food streets and local restaurants

Day 1:
- Travel from ${userlocation} to ${location}
- Check in to your accommodation
- Explore the city center of ${location}
- Visit a nearby landmark
- Try local food for dinner

Day 2:
- Visit the major attractions of ${location}
- Explore the historic area
- Visit a cultural attraction
- Explore the local market
- Have dinner at a popular local restaurant

Day 3:
- Visit a natural attraction near ${location}
- Explore lesser-known places around ${location}
- Try local cuisine
- Visit a scenic viewpoint
- Explore the city in the evening

Day 4:
- Visit any remaining attractions in ${location}
- Buy souvenirs
- Check out from the accommodation
- Travel back from ${location} to ${userlocation}

Food Recommendations:
- Local street food in ${location}
- Traditional cuisine of ${location}
- Popular restaurants in ${location}
- Local cafés and food markets

Local Transportation:
- Public transportation
- Taxi
- Walking
- Rental vehicles where available

Budget:
- Accommodation: ₹8,000–₹12,000
- Food: ₹3,000–₹5,000
- Transportation: ₹2,000–₹3,000
- Activities: ₹2,000–₹4,000

Travel Tips:
- Book accommodation near the center of ${location}
- Start sightseeing early
- Check attraction timings before visiting
- Keep some free time for exploring ${location}
- Try local food and experiences
`,
        meta: {
            timestamp: new Date().toISOString(),
        },
    };
};
