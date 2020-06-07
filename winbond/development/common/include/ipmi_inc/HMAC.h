/*
 ---------------------------------------------------------------------------
 Copyright (c) 2002, Dr Brian Gladman <brg@gladman.me.uk>, Worcester, UK.
 All rights reserved.

 LICENSE TERMS

 The free distribution and use of this software in both source and binary
 form is allowed (with or without changes) provided that:

   1. distributions of this source code include the above copyright
      notice, this list of conditions and the following disclaimer;

   2. distributions in binary form include the above copyright
      notice, this list of conditions and the following disclaimer
      in the documentation and/or other associated materials;

   3. the copyright holder's name is not used to endorse products
      built using this software without specific written permission.

 ALTERNATIVELY, provided that this notice is retained in full, this product
 may be distributed under the terms of the GNU General Public License (GPL),
 in which case the provisions of the GPL apply INSTEAD OF those given above.

 DISCLAIMER

 This software is provided 'as is' with no explicit or implied warranties
 in respect of its properties, including, but not limited to, correctness
 and/or fitness for purpose.
 ---------------------------------------------------------------------------
 Issue Date: 24/01/2003

 This is an implementation of HMAC, the FIPS standard keyed hash function
*/

#ifndef _HMAC_H
#define _HMAC_H

#include "Types.h"
#include "SHA1.h"

/**** Definitions ****/
#define IN_BLOCK_LENGTH     SHA1_BLOCK_SIZE
#define OUT_BLOCK_LENGTH    SHA1_DIGEST_SIZE
#define HMAC_IN_DATA        0xffffffff

#define HMAC_OK               0
#define HMAC_BAD_MODE        -1

#pragma pack( 1 )

typedef struct
{
	INT8U		key [IN_BLOCK_LENGTH];
    Sha1_Ctx_T  ctx [1];
    INT32U		klen;

} PACKED  Hmac_Ctx_T;

#pragma pack( )

void hmac_sha1_begin (Hmac_Ctx_T cx[1]);
int  hmac_sha1_key (_FAR_ INT8U* pkey, INT32U key_len, _NEAR_ Hmac_Ctx_T* pcx);
void hmac_sha1_data (_FAR_ INT8U* pdata, INT32U data_len, _NEAR_ Hmac_Ctx_T* pcx);
void hmac_sha1_end (_FAR_ INT8U* pmac, INT32U mac_len, _NEAR_ Hmac_Ctx_T* pcx);
void hmac_sha1 (_FAR_ INT8U* pkey, INT16U key_len, _FAR_ INT8U* pdata, INT16U data_len, _FAR_ INT8U* pmac, INT16U mac_len);


#endif
