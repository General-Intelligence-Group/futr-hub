# Exploring data with interactive Grafana Dashboards

The Platform uses [Grafana](https://grafana.com/) as the central Dashboard Tool.

We have currently two Instances of Grafana deployed.
- Grafana for Data Management [https://grafana.\<your.domain>/](https://grafana.\<your.domain>)
- Grafana for Monitoring [https://monitoring.\<your.domain>/](https://monitoring.\<your.domain>)

Both Systems behave in the same way - so the following documentation is valid for both.

If you open Grafana and have no valid User Session, you will be asked to login.

![Grafana Login Page](images/grafana_01.png)

Please hit the button `Sign in with OAuth` to use the OAuth Login of Keycloak. How to use this is described in [this documentation](getting_started/IDM_first_steps.md)

After Signing-In you will be redirected to the following page.

![Grafana Landing Page](images/grafana_02.png)

Garafa opens automatically the `Home` Dashboard. With a click on the `Home`-Link at the top you can choose between the already deployed Dashboards.

![Grafana Dashboard List](images/grafana_03.png)

By choosing one of the listed Dashboards the respective Dashboard is opened.

As an Example the following Dashboard is shown.

![Grafana Example Dashboard](images/grafana_04.png)

For a further Usage of Grafana, please have a look in the original Documentation:

- [Datasource Management](https://grafana.com/docs/grafana/latest/datasources/)
- [Panel Management](https://grafana.com/docs/grafana/latest/)
- [Dashboard Management](https://grafana.com/docs/grafana/latest/dashboards/)
