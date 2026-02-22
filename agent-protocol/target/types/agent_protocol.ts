/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/agent_protocol.json`.
 */
export type AgentProtocol = {
  "address": "GEtqx8oSqZeuEnMKmXMPCiDsXuQBoVk1q72SyTWxJYUG",
  "metadata": {
    "name": "agentProtocol",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "autoRelease",
      "discriminator": [
        212,
        34,
        30,
        246,
        192,
        13,
        97,
        31
      ],
      "accounts": [
        {
          "name": "agent",
          "writable": true
        },
        {
          "name": "agentProfile",
          "writable": true
        },
        {
          "name": "job",
          "writable": true
        },
        {
          "name": "client",
          "writable": true
        },
        {
          "name": "parentJob",
          "docs": [
            "Optional parent job — required when job.parent_job is Some"
          ],
          "writable": true,
          "optional": true
        }
      ],
      "args": []
    },
    {
      "name": "cancelJob",
      "discriminator": [
        126,
        241,
        155,
        241,
        50,
        236,
        83,
        118
      ],
      "accounts": [
        {
          "name": "client",
          "writable": true,
          "signer": true
        },
        {
          "name": "job",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "delegateTask",
      "discriminator": [
        204,
        242,
        231,
        107,
        78,
        130,
        187,
        57
      ],
      "accounts": [
        {
          "name": "delegatingAgent",
          "writable": true,
          "signer": true
        },
        {
          "name": "parentJob",
          "writable": true
        },
        {
          "name": "subAgentProfile"
        },
        {
          "name": "childJob",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  106,
                  111,
                  98
                ]
              },
              {
                "kind": "account",
                "path": "delegatingAgent"
              },
              {
                "kind": "account",
                "path": "subAgentProfile"
              },
              {
                "kind": "arg",
                "path": "timestampSeed"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "delegationAmount",
          "type": "u64"
        },
        {
          "name": "timestampSeed",
          "type": "i64"
        }
      ]
    },
    {
      "name": "invokeAgent",
      "discriminator": [
        104,
        136,
        179,
        82,
        239,
        111,
        114,
        67
      ],
      "accounts": [
        {
          "name": "client",
          "writable": true,
          "signer": true
        },
        {
          "name": "agentProfile"
        },
        {
          "name": "job",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  106,
                  111,
                  98
                ]
              },
              {
                "kind": "account",
                "path": "client"
              },
              {
                "kind": "account",
                "path": "agentProfile"
              },
              {
                "kind": "arg",
                "path": "timestampSeed"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "paymentLamports",
          "type": "u64"
        },
        {
          "name": "autoReleaseSeconds",
          "type": {
            "option": "i64"
          }
        },
        {
          "name": "timestampSeed",
          "type": "i64"
        }
      ]
    },
    {
      "name": "raiseDispute",
      "discriminator": [
        41,
        243,
        1,
        51,
        150,
        95,
        246,
        73
      ],
      "accounts": [
        {
          "name": "disputant",
          "signer": true
        },
        {
          "name": "job",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "rateAgent",
      "discriminator": [
        62,
        30,
        240,
        125,
        81,
        120,
        134,
        78
      ],
      "accounts": [
        {
          "name": "client",
          "writable": true,
          "signer": true
        },
        {
          "name": "job"
        },
        {
          "name": "agentProfile",
          "writable": true
        },
        {
          "name": "rating",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  97,
                  116,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "job"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "score",
          "type": "u8"
        }
      ]
    },
    {
      "name": "registerAgent",
      "discriminator": [
        135,
        157,
        66,
        195,
        2,
        113,
        175,
        30
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "agentProfile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  103,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "capabilities",
          "type": "u16"
        },
        {
          "name": "priceLamports",
          "type": "u64"
        }
      ]
    },
    {
      "name": "releasePayment",
      "discriminator": [
        24,
        34,
        191,
        86,
        145,
        160,
        183,
        233
      ],
      "accounts": [
        {
          "name": "client",
          "writable": true,
          "signer": true
        },
        {
          "name": "agent",
          "writable": true
        },
        {
          "name": "agentProfile",
          "writable": true
        },
        {
          "name": "job",
          "writable": true
        },
        {
          "name": "parentJob",
          "docs": [
            "Optional parent job — required when job.parent_job is Some"
          ],
          "writable": true,
          "optional": true
        }
      ],
      "args": []
    },
    {
      "name": "resolveDisputeByTimeout",
      "discriminator": [
        66,
        148,
        177,
        141,
        200,
        85,
        17,
        164
      ],
      "accounts": [
        {
          "name": "client",
          "writable": true
        },
        {
          "name": "job",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "updateJob",
      "discriminator": [
        83,
        224,
        93,
        51,
        200,
        36,
        89,
        214
      ],
      "accounts": [
        {
          "name": "agent",
          "signer": true
        },
        {
          "name": "job",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "resultUri",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "agentProfile",
      "discriminator": [
        60,
        227,
        42,
        24,
        0,
        87,
        86,
        205
      ]
    },
    {
      "name": "job",
      "discriminator": [
        75,
        124,
        80,
        203,
        161,
        180,
        202,
        80
      ]
    },
    {
      "name": "rating",
      "discriminator": [
        203,
        130,
        231,
        178,
        120,
        130,
        70,
        17
      ]
    }
  ],
  "events": [
    {
      "name": "agentRated",
      "discriminator": [
        116,
        96,
        76,
        234,
        149,
        184,
        152,
        63
      ]
    },
    {
      "name": "agentRegistered",
      "discriminator": [
        191,
        78,
        217,
        54,
        232,
        100,
        189,
        85
      ]
    },
    {
      "name": "disputeRaised",
      "discriminator": [
        246,
        167,
        109,
        37,
        142,
        45,
        38,
        176
      ]
    },
    {
      "name": "disputeResolved",
      "discriminator": [
        121,
        64,
        249,
        153,
        139,
        128,
        236,
        187
      ]
    },
    {
      "name": "jobCancelled",
      "discriminator": [
        203,
        84,
        143,
        130,
        48,
        134,
        74,
        191
      ]
    },
    {
      "name": "jobCompleted",
      "discriminator": [
        176,
        207,
        246,
        115,
        95,
        179,
        9,
        132
      ]
    },
    {
      "name": "jobCreated",
      "discriminator": [
        48,
        110,
        162,
        177,
        67,
        74,
        159,
        131
      ]
    },
    {
      "name": "jobDelegated",
      "discriminator": [
        217,
        35,
        110,
        196,
        61,
        233,
        158,
        11
      ]
    },
    {
      "name": "paymentReleased",
      "discriminator": [
        160,
        132,
        155,
        232,
        46,
        254,
        69,
        219
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "nameTooLong",
      "msg": "Agent name too long (max 32 chars)"
    },
    {
      "code": 6001,
      "name": "descriptionTooLong",
      "msg": "Description too long (max 256 chars)"
    },
    {
      "code": 6002,
      "name": "invalidPrice",
      "msg": "Price must be greater than zero"
    },
    {
      "code": 6003,
      "name": "agentNotActive",
      "msg": "Agent is not active"
    },
    {
      "code": 6004,
      "name": "insufficientPayment",
      "msg": "Insufficient payment"
    },
    {
      "code": 6005,
      "name": "invalidJobStatus",
      "msg": "Invalid job status for this operation"
    },
    {
      "code": 6006,
      "name": "unauthorized",
      "msg": "unauthorized"
    },
    {
      "code": 6007,
      "name": "invalidRating",
      "msg": "Rating must be between 1 and 5"
    },
    {
      "code": 6008,
      "name": "insufficientEscrow",
      "msg": "Insufficient escrow balance for delegation"
    },
    {
      "code": 6009,
      "name": "emptyResultUri",
      "msg": "Result URI is required"
    },
    {
      "code": 6010,
      "name": "emptyDescription",
      "msg": "Description is required"
    },
    {
      "code": 6011,
      "name": "autoReleaseNotReady",
      "msg": "Auto-release time has not been reached"
    },
    {
      "code": 6012,
      "name": "noAutoRelease",
      "msg": "No auto-release configured for this job"
    },
    {
      "code": 6013,
      "name": "disputeTimeoutNotReached",
      "msg": "Dispute timeout has not been reached"
    },
    {
      "code": 6014,
      "name": "unresolvedChildren",
      "msg": "Agent has unresolved child delegations"
    },
    {
      "code": 6015,
      "name": "parentJobMismatch",
      "msg": "Parent job mismatch"
    },
    {
      "code": 6016,
      "name": "overflow",
      "msg": "Arithmetic overflow"
    },
    {
      "code": 6017,
      "name": "tooManyDelegations",
      "msg": "Too many active delegations (max 8)"
    }
  ],
  "types": [
    {
      "name": "agentProfile",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "capabilities",
            "type": "u16"
          },
          {
            "name": "priceLamports",
            "type": "u64"
          },
          {
            "name": "isActive",
            "type": "bool"
          },
          {
            "name": "ratingSum",
            "type": "u64"
          },
          {
            "name": "ratingCount",
            "type": "u32"
          },
          {
            "name": "jobsCompleted",
            "type": "u32"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "agentRated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "agent",
            "type": "pubkey"
          },
          {
            "name": "rater",
            "type": "pubkey"
          },
          {
            "name": "score",
            "type": "u8"
          },
          {
            "name": "newAvgX100",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "agentRegistered",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "agent",
            "type": "pubkey"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "priceLamports",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "disputeRaised",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "job",
            "type": "pubkey"
          },
          {
            "name": "raisedBy",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "disputeResolved",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "job",
            "type": "pubkey"
          },
          {
            "name": "refundLamports",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "job",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "client",
            "type": "pubkey"
          },
          {
            "name": "agent",
            "type": "pubkey"
          },
          {
            "name": "escrowLamports",
            "type": "u64"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "jobStatus"
              }
            }
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "resultUri",
            "type": "string"
          },
          {
            "name": "parentJob",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "activeChildren",
            "type": "u8"
          },
          {
            "name": "autoReleaseAt",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "disputedAt",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "completedAt",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "timestampSeed",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "jobCancelled",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "job",
            "type": "pubkey"
          },
          {
            "name": "client",
            "type": "pubkey"
          },
          {
            "name": "refundLamports",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "jobCompleted",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "job",
            "type": "pubkey"
          },
          {
            "name": "agent",
            "type": "pubkey"
          },
          {
            "name": "resultUri",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "jobCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "job",
            "type": "pubkey"
          },
          {
            "name": "client",
            "type": "pubkey"
          },
          {
            "name": "agent",
            "type": "pubkey"
          },
          {
            "name": "escrowLamports",
            "type": "u64"
          },
          {
            "name": "autoReleaseAt",
            "type": {
              "option": "i64"
            }
          }
        ]
      }
    },
    {
      "name": "jobDelegated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "parentJob",
            "type": "pubkey"
          },
          {
            "name": "childJob",
            "type": "pubkey"
          },
          {
            "name": "delegatingAgent",
            "type": "pubkey"
          },
          {
            "name": "subAgent",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "jobStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "pending"
          },
          {
            "name": "inProgress"
          },
          {
            "name": "completed"
          },
          {
            "name": "disputed"
          },
          {
            "name": "cancelled"
          },
          {
            "name": "finalized"
          }
        ]
      }
    },
    {
      "name": "paymentReleased",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "job",
            "type": "pubkey"
          },
          {
            "name": "agent",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "autoReleased",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "rating",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "agent",
            "type": "pubkey"
          },
          {
            "name": "rater",
            "type": "pubkey"
          },
          {
            "name": "job",
            "type": "pubkey"
          },
          {
            "name": "score",
            "type": "u8"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
