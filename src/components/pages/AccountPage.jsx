import { useAuth } from '@/hooks/auth/AuthContext';
import React, { useState } from 'react';
import ProfilePicture from '../custom-components/ProfilePicture';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '../ui/input-group';
import { Label } from '../ui/label';
import { Item, ItemContent, ItemTitle } from '../ui/item';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from '../ui/field';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Info } from 'lucide-react';

export default function AccountPage() {
  const [editMode, setEditMode] = useState(false);
  const { user } = useAuth();
  return (
    <main className="w-full min-h-screen flex flex-col p-5">
      <h1 className="font-bold text-4xl text-secure-blue">Account</h1>
      <div className="flex flex-row justify-between">
        <ProfilePicture className={'size-20'} />
        <div className="flex flex-row gap-2">
          <Button variant="outline" onClick={() => setEditMode(true)}>
            Edit
          </Button>
          <Button
            variant="outline"
            disabled={!editMode}
            onClick={() => setEditMode(false)}
            className={
              editMode
                ? 'bg-secure-orange text-white hover:bg-secure-blue hover:text-white'
                : ''
            }
          >
            Save Changes
          </Button>
        </div>
      </div>
      {/* <InputGroup>
        <InputGroupInput
          defaultValue={user.displayName}
          disabled={!editMode}
          id="displayName"
        ></InputGroupInput>
        <InputGroupAddon align="block-start">
          <Label className="text-foreground" htmlFor="displayName">
            Display Name
          </Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <InputGroupButton className="rounded-full ml-auto" size="icon-xs">
                <Info />
              </InputGroupButton>
            </TooltipTrigger>
            <TooltipContent>Your name.</TooltipContent>
          </Tooltip>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput
          defaultValue={user.email}
          disabled={!editMode}
        ></InputGroupInput>
        <InputGroupAddon align="block-start">
          <Label className="text-foreground" htmlFor="email">
            Email
          </Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <InputGroupButton className="rounded-full ml-auto" size="icon-xs">
                <Info />
              </InputGroupButton>
            </TooltipTrigger>
            <TooltipContent>Your email.</TooltipContent>
          </Tooltip>
        </InputGroupAddon>
      </InputGroup> */}
      <FieldGroup>
        <div className="grid grid-cols-3 gap-3">
          <Field variant="outline">
            <FieldTitle>
              <FieldLabel htmlFor="displayName">Display Name</FieldLabel>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="rounded-full ml-auto"
                    variant="outline"
                    size="icon-xs"
                  >
                    <Info />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Your name.</TooltipContent>
              </Tooltip>
            </FieldTitle>
            <Input
              id="displayName"
              value={user.displayName}
              disabled={!editMode}
            />
          </Field>
          <Field variant="outline">
            <FieldTitle>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="rounded-full ml-auto"
                    variant="outline"
                    size="icon-xs"
                  >
                    <Info />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Your email.</TooltipContent>
              </Tooltip>
            </FieldTitle>
            <Input id="email" value={user.email} disabled={!editMode} />
          </Field>
          <Field variant="outline">
            <FieldTitle>
              <FieldLabel htmlFor="displayName">Joined On</FieldLabel>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="rounded-full ml-auto"
                    variant="outline"
                    size="icon-xs"
                  >
                    <Info />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>The day you joined SecureBYTE</TooltipContent>
              </Tooltip>
            </FieldTitle>
            <FieldDescription>{user.metadata.creationTime}</FieldDescription>
            <ItemContent></ItemContent>
          </Field>
        </div>
      </FieldGroup>
      <Item variant="outline" size="sm">
        <ItemTitle>Joined On</ItemTitle>
      </Item>
    </main>
  );
}
