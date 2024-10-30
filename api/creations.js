// export const config = {
//   runtime: 'edge', // Specifies the Edge runtime
// };

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const genieUrl = 'https://webapp.engineeringlumalabs.com/api/v3/creations';

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
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.writeHead(405, {
      ...corsHeaders,
      Allow: 'POST',
    });
    res.end('Method Not Allowed');
    return;
  }

  const { prompt, token } = req.body;

  // const encoder = new TextEncoder();

  // const { prompt } = req.body;

  // const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // const stream = await model.generateContentStream(prompt);
  // const response = await result.response;
  // const text = response.text();
  try {
    const genieData = {
      input: {
        text: prompt,
        type: 'imagine_3d_one',
        // Generate random digits
        jobParams: {
          seed: Math.floor(Math.random() * 1000000000)
            .toString()
            .padStart(9, '0'),
        },
      },
      client: 'web',
    };
    const response = await fetch(genieUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(genieData), // Convert the data object to a JSON string
    });
    // if (response.status !== 'success') {
    //   throw new Error('Could not fetch genie');
    // }
    const data = await response.json();

    res.writeHead(200, {
      ...corsHeaders,
      'Content-Type': 'application/json',
    });

    return res.end(JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
}
