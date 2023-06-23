/*
 * API Base
 */

export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
//console.log("NEXT_PUBLIC_BASE_URL: ", process.env.NEXT_PUBLIC_BASE_URL);

/*
 * Fetch page json.
 */
export const fetchPage = async (name: string) => {
  const response = await fetch(`${baseUrl}/pages/${name}`, {
    next: { revalidate: 10 },
  });
  return response.json();
};

/*
 * Fetch calendar data.
 */
export const fetchCalendarEvents = async () => {
  const response = await fetch(`${baseUrl}/calendar/events`);
  return response.json();
};

/*
 * Post the connect form.
 */
export const postConnectForm = async (data: Object) => {
  const response = await fetch(`${baseUrl}/inquiries/new`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
};

/*
 * Fetch visitor ip address.
 */
export const fetchVisitorIP = async () => {
  try {
    const response = await fetch(`https://api.ipify.org?format=json`);
    return response.json();
  } catch (err) {
    throw err;
  }
};

/*
 * Post visitor ip address.
 */
export const postVisitorIP = async (data: { ip: string }) => {
  const response = await fetch(`${baseUrl}/analytics/visitor`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
};
