require 'spec_helper'

describe service('docker'), :if => os[:family] == 'ubuntu' do
  it { should be_enabled }
  it { should be_running }
end

# Check Traefik is running as expected
describe docker_container('traefik') do
  it { should be_running }
  it { should have_volume('/var/run/docker.sock','/var/run/docker.sock') }
end

# Check Platform Orchestration is running as expected
describe docker_container('portainer') do
  it { should be_running }
  it { should have_volume('/var/run/docker.sock','/var/run/docker.sock') }
end

describe docker_container('pgadmin') do
  it { should be_running }
end


# Check Keycloak and Database is running as expected
describe docker_container('keycloak-db') do
  it { should be_running }
end

describe docker_container('keycloak') do
  it { should be_running }
end

# Check Gravitee and Database is running as expected
describe docker_container('apim-mongo') do
  it { should be_running }
end

describe docker_container('apim-elastic') do
  it { should be_running }
end

describe docker_container('apim-gateway') do
  it { should be_running }
end

describe docker_container('apim-management') do
  it { should be_running }
end

describe docker_container('apim-management-ui') do
  it { should be_running }
end

describe docker_container('apim-portal-ui') do
  it { should be_running }
end

# Check Context Management is running as expected
describe docker_container('fiware-mongo-db') do
  it { should be_running }
end

describe docker_container('orion-v2') do
  it { should be_running }
end

describe docker_container('frost-postgis-db') do
  it { should be_running }
end

describe docker_container('frost') do
  it { should be_running }
end

# Check Monitoring is running as expected
describe docker_container('prometheus') do
  it { should be_running }
end

describe docker_container('node-exporter') do
  it { should be_running }
end

describe docker_container('cadvisor') do
  it { should be_running }
end

describe docker_container('monitoring') do
  it { should be_running }
end

describe docker_container('timescale') do
  it { should be_running }
end

describe docker_container('grafana') do
  it { should be_running }
end

describe docker_container('quantumleap') do
  it { should be_running }
end

# Check Data-Flows is running as expected

describe docker_container('nr-ext') do
  it { should be_running }
end

# Check Public is running as expected
describe docker_container('portainer-kc') do
  it { should be_running }
end

describe docker_container('nr-ext-kc') do
  it { should be_running }
end
