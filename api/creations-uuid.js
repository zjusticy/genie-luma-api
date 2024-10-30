// export const config = {
//   runtime: 'edge', // Specifies the Edge runtime
// };

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const genieSingleUrl =
  'https://webapp.engineeringlumalabs.com/api/v3/creations/uuid';

// const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// const cors = Cors({
//   methods: ['POST', 'GET', 'HEAD'],
// });

// function runMiddleware(req, res, fn) {
//   return new Promise((resolve, reject) => {
//     fn(req, res, (result) => {
//       if (result instanceof Error) {
//         return reject(result);
//       }

//       return resolve(result);
//     });
//   });
// }

export default async function handler(req, res) {
  // const { host } = req.headers;
  // const url = new URL(`https://${host}/${req.url}`);
  // const urlParams = url.searchParams;
  // const provider = urlParams.get('provider');

  // await runMiddleware(req, res, cors);

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const { uuid } = req.query;

  // const encoder = new TextEncoder();

  // const { prompt } = req.body;

  // const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // const stream = await model.generateContentStream(prompt);
  // const response = await result.response;
  // const text = response.text();
  try {
    const response = await fetch(`${genieSingleUrl}/${uuid}`);
    // if (response.status !== 'success') {
    //   throw new Error('Could not fetch genie');
    // }
    const data = await response.json();

    return res.status(200).json(data, {
      headers: {
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.log(error);
  }
}
