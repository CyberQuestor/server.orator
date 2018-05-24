# 0.0.1

First public release

    - Introduce Redis-storage instead of file storage
    - Refactoring:
    		- Translation of text - for controller hears and says
    		- Environment files in project merges with `/etc/default/haystack`
    		- Logging like log4j at `/var/log/haystack`
    		- Project structure - components, controllers (endpoint, skills, middleware), utilities (common, proactive-addresses)
    		- Rename `msbot.js` as `botframework.js`
		- Store user and conversation data in DB of choice (cassandra)
  	- Proactive messages support through consumer; addition of `trumpet`
  	- Incorporate new alias flow
  	- Explore write and read channel (for user and conversation data) through `announcer` for Haystack information purposes. Basic conversation data can continue to use file storage or Redis as it stands now.
  	- Secure access to DB (Redis)
  	- Secure access to DB (cassandra through `announcer`)
  	- Secure access to `trumpet` (basic authentication)
  	- Ensure all above changes are adopted in code (like env variables and logging)
