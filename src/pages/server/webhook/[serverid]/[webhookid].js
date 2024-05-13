const WebhookEditPage = ({ data, webhookData }) => {
  return <div>Webhooks for {data.name}</div>;
};

export async function getServerSideProps({ params }) {
  const { serverid, webhookid } = params;

  try {
    const response = await fetch(
      process.env.SITE_URI + `/api/servers?_id=${serverid}`
    );

    const responseWebhook = await fetch(
      process.env.SITE_URI + `/api/webhooks?_id=${webhookid}`
    );

    const responseJson = await response.json();
    const responseWebhookJson = await responseWebhook.json();

    const data = responseJson.data;
    const webhookData = responseWebhookJson.data;

    return {
      props: {
        data,
        webhookData,
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
