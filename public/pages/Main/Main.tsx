/*
 * Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

import React, { Component } from "react";
import { Switch, Route, Redirect, RouteComponentProps } from "react-router-dom";
// @ts-ignore
import { EuiSideNav, EuiPage, EuiPageBody, EuiPageSideBar } from "@elastic/eui";
import Policies from "../Policies";
import ManagedIndices from "../ManagedIndices";
import Indices from "../Indices";
import CreatePolicy from "../CreatePolicy";
import ChangePolicy from "../ChangePolicy";
import { ModalProvider, ModalRoot } from "../../components/Modal";
import { ServicesConsumer } from "../../services";
import { BrowserServices } from "../../models/interfaces";
import { ROUTES } from "../../utils/constants";

enum Navigation {
  IndexManagement = "Index Management",
  IndexPolicies = "Index Policies",
  ManagedIndices = "Managed Indices",
  Indices = "Indices",
}

enum Pathname {
  IndexPolicies = "/index-policies",
  ManagedIndices = "/managed-indices",
  Indices = "/indices",
}

interface MainProps extends RouteComponentProps {}

export default class Main extends Component<MainProps, object> {
  render() {
    const {
      location: { pathname },
    } = this.props;
    const sideNav = [
      {
        name: Navigation.IndexManagement,
        id: 0,
        href: `#${Pathname.IndexPolicies}`,
        items: [
          {
            name: Navigation.IndexPolicies,
            id: 1,
            href: `#${Pathname.IndexPolicies}`,
            isSelected: pathname === Pathname.IndexPolicies,
          },
          {
            name: Navigation.ManagedIndices,
            id: 2,
            href: `#${Pathname.ManagedIndices}`,
            isSelected: pathname === Pathname.ManagedIndices,
          },
          {
            name: Navigation.Indices,
            id: 3,
            href: `#${Pathname.Indices}`,
            isSelected: pathname === Pathname.Indices,
          },
        ],
      },
    ];
    return (
      <ServicesConsumer>
        {(services: BrowserServices | null) =>
          services && (
            <ModalProvider>
              <ModalRoot services={services} />
              <EuiPage>
                <EuiPageSideBar style={{ minWidth: 150 }}>
                  <EuiSideNav style={{ width: 150 }} items={sideNav} />
                </EuiPageSideBar>
                <EuiPageBody>
                  <Switch>
                    <Route
                      path={ROUTES.CHANGE_POLICY}
                      render={(props: RouteComponentProps) => (
                        <ChangePolicy {...props} managedIndexService={services.managedIndexService} indexService={services.indexService} />
                      )}
                    />
                    <Route
                      path={ROUTES.CREATE_POLICY}
                      render={(props: RouteComponentProps) => (
                        <CreatePolicy {...props} isEdit={false} policyService={services.policyService} />
                      )}
                    />
                    <Route
                      path={ROUTES.EDIT_POLICY}
                      render={(props: RouteComponentProps) => (
                        <CreatePolicy {...props} isEdit={true} policyService={services.policyService} />
                      )}
                    />
                    <Route
                      path={ROUTES.INDEX_POLICIES}
                      render={(props: RouteComponentProps) => (
                        <div style={{ padding: "25px 25px" }}>
                          <Policies {...props} policyService={services.policyService} />
                        </div>
                      )}
                    />
                    <Route
                      path={ROUTES.MANAGED_INDICES}
                      render={(props: RouteComponentProps) => (
                        <div>
                          <ManagedIndices {...props} managedIndexService={services.managedIndexService} />
                        </div>
                      )}
                    />
                    <Route
                      path={ROUTES.INDICES}
                      render={(props: RouteComponentProps) => (
                        <div style={{ padding: "25px 25px" }}>
                          <Indices {...props} indexService={services.indexService} />
                        </div>
                      )}
                    />
                    <Redirect from="/" to={ROUTES.INDEX_POLICIES} />
                  </Switch>
                </EuiPageBody>
              </EuiPage>
            </ModalProvider>
          )
        }
      </ServicesConsumer>
    );
  }
}
