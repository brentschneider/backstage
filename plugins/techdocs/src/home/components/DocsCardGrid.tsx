/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';

import { Entity } from '@backstage/catalog-model';
import { configApiRef, useApi, useRouteRef } from '@backstage/core-plugin-api';
import { Card, CardActions, CardContent, CardMedia } from '@material-ui/core';
import { rootDocsRouteRef } from '../../routes';

import {
  Button,
  ItemCardGrid,
  ItemCardHeader,
} from '@backstage/core-components';

export const DocsCardGrid = ({
  entities,
}: {
  entities: Entity[] | undefined;
}) => {
  const getRouteToReaderPageFor = useRouteRef(rootDocsRouteRef);

  // Lower-case entity triplets by default, but allow override.
  const toLowerMaybe = useApi(configApiRef).getOptionalBoolean(
    'techdocs.legacyUseCaseSensitiveTripletPaths',
  )
    ? (str: string) => str
    : (str: string) => str.toLocaleLowerCase();

  if (!entities) return null;
  return (
    <ItemCardGrid data-testid="docs-explore">
      {!entities?.length
        ? null
        : entities.map((entity, index: number) => (
            <Card key={index}>
              <CardMedia>
                <ItemCardHeader title={entity.metadata.name} />
              </CardMedia>
              <CardContent>{entity.metadata.description}</CardContent>
              <CardActions>
                <Button
                  to={getRouteToReaderPageFor({
                    namespace: toLowerMaybe(
                      entity.metadata.namespace ?? 'default',
                    ),
                    kind: toLowerMaybe(entity.kind),
                    name: toLowerMaybe(entity.metadata.name),
                  })}
                  color="primary"
                >
                  Read Docs
                </Button>
              </CardActions>
            </Card>
          ))}
    </ItemCardGrid>
  );
};
