#!/bin/bash

echo -e "\n\nStart Building NextJS Application\n"
npm run build
echo -e "Start Building NextJS Application\n\n"

echo -e "Start Reloading PM2\n"
pm2 restart sms-ui
echo -e "End Reloading PM2\n\n"

echo -e "Start Reloading NGINX\n"
systemctl reload nginx
echo -e "End Reloading NGINX\n\n"

