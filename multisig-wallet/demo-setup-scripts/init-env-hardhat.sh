cat <<EOENV > .env
# Replace placeholders ???

## Needed to run the Web3 Actions Locally
#https://docs.tenderly.co/other/platform-access/how-to-find-the-project-slug-username-and-organization-name
TENDERLY_PROJECT_SLUG=???
TENDERLY_USERNAME=???

# https://docs.tenderly.co/other/platform-access/how-to-generate-api-access-tokens
TENDERLY_ACCESS_KEY=???

# https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks
DISCORD_URL=???

## needed if planning to deploy your own contracts, otherwise skip
ROPSTEN_URL=<ROPSTEN_URL>
ROPSTEN_PRIVATE_KEY_1=???
ROPSTEN_PRIVATE_KEY_2=???
ROPSTEN_PRIVATE_KEY_3=???

EOENV