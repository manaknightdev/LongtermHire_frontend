export const jenkinsFrontendConfig=(project:string)=> {
  return `
  cd ${project}_frontend/;
echo "pull";
echo -e "ln8kmyhfezQ4kjyngk2cgA\n" | sudo -S git switch master
echo -e "ln8kmyhfezQ4kjyngk2cgA\n" | sudo -S git pull origin master
echo -e "ln8kmyhfezQ4kjyngk2cgA\n" | sudo -S chmod +x deploy.sh
echo -e "ln8kmyhfezQ4kjyngk2cgA\n" | sudo -S ./deploy.sh
cd ../;
echo "done";
`}