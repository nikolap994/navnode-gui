const WebhookEditPage = ({ data }) => {
  return <div>Webhooks for {data.name}</div>;
};

export async function getServerSideProps({ params }) {
  const { serverid } = params;

  try {
    const response = await fetch(
      process.env.SITE_URI + `/api/servers?_id=${serverid}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch server data");
    }
    const responseJson = await response.json();
    const data = responseJson.data;
    return {
      props: {
        data,
      },
    };
  } catch (error) {
    console.error("Error fetching server data:", error);
    return {
      props: {
        data: null,
      },
    };
  }
}

export default WebhookEditPage;
